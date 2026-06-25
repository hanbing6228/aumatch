import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

// Calendly webhook receiver. Subscribe (via the Calendly API) to
// `invitee.created` and `invitee.canceled`, pointing at:
//   <AUTH_URL>/api/calendly/webhook
// Set CALENDLY_WEBHOOK_SIGNING_KEY to the subscription's signing key.

export const runtime = "nodejs";

// Verifies the `Calendly-Webhook-Signature: t=<ts>,v1=<hmac>` header.
function verifySignature(rawBody: string, header: string | null, key: string) {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=").map((s) => s.trim())),
  ) as { t?: string; v1?: string };
  if (!parts.t || !parts.v1) return false;

  const expected = crypto
    .createHmac("sha256", key)
    .update(`${parts.t}.${rawBody}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const raw = await req.text();
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

  if (signingKey) {
    const ok = verifySignature(
      raw,
      req.headers.get("calendly-webhook-signature"),
      signingKey,
    );
    if (!ok) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: {
    event?: string;
    payload?: {
      uri?: string;
      email?: string;
      name?: string;
      scheduled_event?: {
        uri?: string;
        name?: string;
        start_time?: string;
        end_time?: string;
      };
    };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const p = event.payload;
  const eventUri = p?.scheduled_event?.uri ?? p?.uri;
  if (!eventUri) {
    return NextResponse.json({ ok: true, skipped: "no event uri" });
  }

  const status = event.event === "invitee.canceled" ? "CANCELED" : "SCHEDULED";

  await prisma.consultBooking.upsert({
    where: { calendlyEventUri: eventUri },
    update: {
      status,
      rawPayload: event as object,
      fullName: p?.name ?? undefined,
      email: p?.email?.toLowerCase() ?? undefined,
    },
    create: {
      calendlyEventUri: eventUri,
      calendlyInviteeId: p?.uri,
      topic: p?.scheduled_event?.name,
      fullName: p?.name ?? "Calendly invitee",
      email: p?.email?.toLowerCase() ?? "unknown@calendly",
      startTime: p?.scheduled_event?.start_time
        ? new Date(p.scheduled_event.start_time)
        : undefined,
      endTime: p?.scheduled_event?.end_time
        ? new Date(p.scheduled_event.end_time)
        : undefined,
      status,
      rawPayload: event as object,
    },
  });

  return NextResponse.json({ ok: true });
}
