import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { employerLeadSchema } from "@/lib/validation";
import { notifyTeam } from "@/lib/notify";
import { verifyRecaptcha } from "@/lib/recaptcha";

// P0 conversion endpoint: employer (family) intake from "Find a Caregiver".
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = (body as { recaptchaToken?: string })?.recaptchaToken;
  if (!(await verifyRecaptcha(token, "employer_lead"))) {
    return NextResponse.json({ error: "Failed bot check" }, { status: 400 });
  }

  const parsed = employerLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const d = parsed.data;
  const lead = await prisma.employerLead.create({
    data: {
      fullName: d.fullName,
      phone: d.phone,
      email: d.email,
      location: d.location,
      services: d.services,
      frequency: d.frequency || null,
      budget: d.budget || null,
      startDate: d.startDate ? new Date(d.startDate) : null,
      notes: d.notes || null,
      locale: d.locale,
    },
    select: { id: true },
  });

  await notifyTeam(`New family lead — ${d.fullName} (${d.location})`, [
    `Name: ${d.fullName}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    `Location: ${d.location}`,
    `Services: ${d.services.join(", ")}`,
    `Frequency: ${d.frequency || "—"}`,
    `Budget: ${d.budget || "—"}`,
    `Start: ${d.startDate || "—"}`,
    `Notes: ${d.notes || "—"}`,
  ]);

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
