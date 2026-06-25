import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { providerApplicationSchema } from "@/lib/validation";
import { notifyTeam } from "@/lib/notify";
import { verifyRecaptcha } from "@/lib/recaptcha";

// P0 conversion endpoint: care professional application from "Join as Provider".
// The resume/certificate file is uploaded separately to blob storage; the
// resulting URL (documentUrl) is sent here. consentBgCheck is mandatory.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = (body as { recaptchaToken?: string })?.recaptchaToken;
  if (!(await verifyRecaptcha(token, "provider_application"))) {
    return NextResponse.json({ error: "Failed bot check" }, { status: 400 });
  }

  const parsed = providerApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const d = parsed.data;
  const app = await prisma.providerApplication.create({
    data: {
      fullName: d.fullName,
      phone: d.phone,
      email: d.email,
      city: d.city,
      availability: d.availability || null,
      expectedRate: d.expectedRate || null,
      documentUrl: d.documentUrl || null,
      documentName: d.documentName || null,
      consentBgCheck: d.consentBgCheck,
      locale: d.locale,
    },
    select: { id: true },
  });

  await notifyTeam(`New provider application — ${d.fullName} (${d.city})`, [
    `Name: ${d.fullName}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    `City: ${d.city}`,
    `Availability: ${d.availability || "—"}`,
    `Expected rate: ${d.expectedRate || "—"}`,
    `Document: ${d.documentName || "—"}`,
    `BG-check consent: ${d.consentBgCheck ? "yes" : "no"}`,
  ]);

  return NextResponse.json({ ok: true, id: app.id }, { status: 201 });
}
