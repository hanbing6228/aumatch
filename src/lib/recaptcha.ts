// Server-side reCAPTCHA v3 verification. When RECAPTCHA_SECRET is unset we skip
// (return true) so the app works in dev / before keys are configured.
const SECRET = process.env.RECAPTCHA_SECRET;
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");

export async function verifyRecaptcha(
  token: string | undefined | null,
  expectedAction?: string,
): Promise<boolean> {
  if (!SECRET) return true; // not configured → skip
  if (!token) return false;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: SECRET, response: token }),
    });
    const data = (await res.json()) as {
      success: boolean;
      score?: number;
      action?: string;
    };
    if (!data.success) return false;
    if (expectedAction && data.action && data.action !== expectedAction) return false;
    if (typeof data.score === "number" && data.score < MIN_SCORE) return false;
    return true;
  } catch {
    // Fail-open on network error so a reCAPTCHA outage never blocks real leads.
    return true;
  }
}
