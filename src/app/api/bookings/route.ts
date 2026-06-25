import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { bookingSchema } from "@/lib/validation";
import { notifyTeam } from "@/lib/notify";

// In-app consultation booking fallback (used when Calendly is not embedded, or
// for the design's native scheduler). Calendly's own bookings arrive via the
// /api/calendly/webhook upsert instead.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const d = parsed.data;
  const booking = await prisma.consultBooking.create({
    data: {
      fullName: d.fullName,
      email: d.email,
      phone: d.phone || null,
      topic: d.topic || null,
      startTime: d.startTime ? new Date(d.startTime) : null,
      locale: d.locale,
    },
    select: { id: true },
  });

  await notifyTeam(`New consult booking — ${d.fullName}`, [
    `Name: ${d.fullName}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone || "—"}`,
    `Topic: ${d.topic || "—"}`,
    `Requested time: ${d.startTime || "—"}`,
  ]);

  return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
}
