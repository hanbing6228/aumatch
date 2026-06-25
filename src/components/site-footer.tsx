"use client";

import { useI18n } from "@/lib/i18n";
import { Sprig } from "./sprig";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer style={{ background: "#101f31", color: "#ecdcc0" }}>
      {/* Trust badges */}
      <div style={{ borderBottom: "1px solid rgba(209,176,105,.16)" }}>
        <div
          className="mx-auto grid max-w-content grid-cols-1 gap-px px-7 md:grid-cols-3"
          style={{ background: "rgba(209,176,105,.16)", paddingTop: 0 }}
        >
          {t.trust.items.map((b, i) => (
            <div key={i} style={{ background: "#101f31", padding: "30px" }}>
              <div className="mb-[10px] flex items-center gap-[11px]">
                <span style={{ color: "#d8b878", fontSize: 11 }}>◆</span>
                <h4 style={{ fontSize: 14, fontWeight: 600, letterSpacing: ".04em", color: "#fff8ec", margin: 0, textTransform: "uppercase" }}>
                  {b.title}
                </h4>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(236,220,192,.55)", margin: 0 }}>{b.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer columns */}
      <div className="mx-auto grid max-w-content grid-cols-1 gap-10 px-7 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-[18px] flex items-center gap-[11px]">
            <Sprig width={18} height={29} color="#d8b878" />
            <span className="au-serif" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1 }}>
              <span style={{ color: "#d8b878" }}>{t.brand.a}</span>
              <span style={{ color: "#fff8ec" }}>{t.brand.b}</span>
            </span>
            <span style={{ fontSize: 9, letterSpacing: ".28em", color: "#d8b878", textTransform: "uppercase" }}>{t.brand.sub}</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(236,220,192,.55)", margin: 0, maxWidth: 300 }}>{t.footer.tagline}</p>
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#d8b878", marginBottom: 16 }}>{t.footer.contactLabel}</div>
          <a href="mailto:info@aumatch.com" style={{ fontSize: 15, color: "#ecdcc0", textDecoration: "none", borderBottom: "1px solid rgba(209,176,105,.4)", paddingBottom: 2 }}>
            info@aumatch.com
          </a>
          <div style={{ fontSize: 13.5, color: "rgba(236,220,192,.5)", marginTop: 14 }}>{t.footer.locale}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#d8b878", marginBottom: 16 }}>{t.footer.areasLabel}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.9, color: "rgba(236,220,192,.55)" }}>{t.footer.areas}</div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(236,220,192,.08)" }}>
        <div className="mx-auto flex max-w-content flex-wrap justify-between gap-[10px] px-7 py-5" style={{ fontSize: 12, color: "rgba(236,220,192,.42)" }}>
          <span>{t.footer.rights}</span>
          <span>{t.footer.langNote}</span>
        </div>
      </div>
    </footer>
  );
}
