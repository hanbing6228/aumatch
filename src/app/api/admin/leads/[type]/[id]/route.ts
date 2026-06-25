import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { HttpError, requireRole } from "@/lib/authz";

const patchSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "PLACED", "CLOSED", "ARCHIVED"]).optional(),
  conciergeNotes: z.string().max(5000).optional(),
});

// Concierge/admin update of a lead's status or internal notes.
// `type` is "employer" or "provider".
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  try {
    await requireRole("ADMIN", "CONCIERGE");
  } catch (e) {
    if (e instanceof HttpError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }

  const { type, id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  if (type === "employer") {
    const updated = await prisma.employerLead.update({
      where: { id },
      data: parsed.data,
      select: { id: true, status: true },
    });
    return NextResponse.json({ ok: true, lead: updated });
  }
  if (type === "provider") {
    const updated = await prisma.providerApplication.update({
      where: { id },
      data: parsed.data,
      select: { id: true, status: true },
    });
    return NextResponse.json({ ok: true, lead: updated });
  }
  return NextResponse.json({ error: "Unknown lead type" }, { status: 400 });
}
