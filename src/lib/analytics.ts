// Thin GA4 wrapper. No-ops safely when GA isn't configured or on the server.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

// Conversion events for the two P0 funnels + booking (per PRD).
export const Conversions = {
  employerLead: () => trackEvent("generate_lead", { lead_type: "employer" }),
  providerApplication: () =>
    trackEvent("generate_lead", { lead_type: "provider" }),
  booking: () => trackEvent("schedule_consult", {}),
};
