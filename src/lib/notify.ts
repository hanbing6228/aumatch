// Lightweight notification hook. The PRD requires that new leads alert the team
// at info@aumatch.com. This is intentionally pluggable: set RESEND_API_KEY to
// enable real email; otherwise it logs (and never throws, so a notification
// failure never blocks a lead from being saved).

const TEAM_EMAIL = process.env.TEAM_NOTIFY_EMAIL || "info@aumatch.com";

export async function notifyTeam(subject: string, lines: string[]) {
  const body = lines.join("\n");
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info(`[notify] (no RESEND_API_KEY) → ${TEAM_EMAIL}: ${subject}\n${body}`);
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "AuMatch <noreply@aumatch.com>",
        to: [TEAM_EMAIL],
        subject,
        text: body,
      }),
    });
  } catch (err) {
    console.error("[notify] email failed", err);
  }
}
