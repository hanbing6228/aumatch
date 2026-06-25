"use client";

import { useEffect, useRef } from "react";

// Loads Calendly's inline widget. Set NEXT_PUBLIC_CALENDLY_URL to your event
// link, e.g. https://calendly.com/aumatch/intro-call
export function CalendlyEmbed({ url, prefill }: { url: string; prefill?: { name?: string; email?: string } }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = "calendly-widget-script";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);

      const s = document.createElement("script");
      s.id = id;
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const params = new URLSearchParams({
    hide_gdpr_banner: "1",
    background_color: "fffaf2",
    text_color: "36291a",
    primary_color: "b1812f",
  });
  if (prefill?.name) params.set("name", prefill.name);
  if (prefill?.email) params.set("email", prefill.email);

  return (
    <div
      ref={ref}
      className="calendly-inline-widget"
      data-url={`${url}?${params.toString()}`}
      style={{ minWidth: 320, height: 680, border: "1px solid rgba(54,41,26,.1)" }}
    />
  );
}
