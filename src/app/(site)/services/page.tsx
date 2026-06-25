"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Sprig } from "@/components/sprig";

export default function ServicesPage() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero */}
      <section style={{ background: "radial-gradient(130% 100% at 50% -16%, #fff8ee 0%, #ecd9b2 70%)", padding: "clamp(76px,9vw,120px) 28px clamp(60px,7vw,92px)" }}>
        <div className="mx-auto max-w-[880px] text-center">
          <div className="au-enter au-kicker" style={{ marginBottom: 22, animationDelay: ".05s" }}>{t.services.kicker}</div>
          <h1 className="au-enter au-serif" style={{ fontWeight: 500, fontSize: "clamp(42px,6vw,74px)", lineHeight: 1.04, color: "#1c3a5e", margin: "0 0 24px", animationDelay: ".14s" }}>{t.services.title}</h1>
          <p className="au-enter" style={{ maxWidth: 600, margin: "0 auto", fontSize: "clamp(16px,1.9vw,18px)", lineHeight: 1.7, color: "rgba(54,41,26,.7)", animationDelay: ".24s" }}>{t.services.sub}</p>
        </div>
      </section>

      {/* Service rows */}
      <section style={{ padding: "clamp(54px,7vw,92px) 28px" }}>
        <div className="mx-auto flex max-w-[1140px] flex-col gap-[22px]">
          {t.services.cards.map((item, i) => (
            <div key={i} className="grid grid-cols-1 gap-7 md:grid-cols-[.85fr_1.15fr]" style={{ background: "#fffaf2", border: "1px solid rgba(54,41,26,.09)", padding: "clamp(34px,3.8vw,52px)" }}>
              <div style={{ paddingRight: "clamp(20px,3vw,40px)" }}>
                <Sprig width={30} height={48} color="#b1812f" style={{ marginBottom: 20 }} />
                <h2 className="au-serif" style={{ fontWeight: 600, fontSize: "clamp(26px,3vw,34px)", lineHeight: 1.12, color: "#1c3a5e", margin: "0 0 14px" }}>{item.name}</h2>
                <div style={{ fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#b1812f" }}>{item.scope}</div>
              </div>
              <div>
                <p style={{ fontSize: 16, lineHeight: 1.74, color: "#6f6450", margin: "0 0 22px" }}>{item.body}</p>
                <div className="grid grid-cols-1 gap-x-[26px] gap-y-3 sm:grid-cols-2">
                  {item.bullets.map((bul) => (
                    <div key={bul} style={{ display: "flex", alignItems: "flex-start", gap: 11, fontSize: 14.5, lineHeight: 1.45, color: "#36291a" }}>
                      <span style={{ color: "#b1812f", fontSize: 9, marginTop: 6 }}>◆</span>
                      {bul}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Includes */}
      <section style={{ padding: "clamp(20px,3vw,40px) 28px clamp(54px,7vw,84px)" }}>
        <div className="mx-auto max-w-[1140px]">
          <div className="mb-[38px] max-w-[560px]">
            <div className="au-kicker mb-4">{t.svcIncludes.kicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(28px,4vw,42px)", lineHeight: 1.1, color: "#36291a", margin: 0 }}>{t.svcIncludes.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 md:grid-cols-4" style={{ background: "rgba(54,41,26,.1)", border: "1px solid rgba(54,41,26,.1)" }}>
            {t.svcIncludes.items.map((it) => (
              <div key={it.title} style={{ background: "#fffaf2", padding: "30px 26px 34px" }}>
                <span style={{ color: "#b1812f", fontSize: 11 }}>◆</span>
                <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 19, color: "#1c3a5e", margin: "14px 0 9px" }}>{it.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.62, color: "#6f6450", margin: 0 }}>{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ (navy) */}
      <section style={{ background: "radial-gradient(120% 120% at 50% -20%, #21405f 0%, #14283f 62%)", color: "#ecdcc0", padding: "clamp(60px,8vw,100px) 28px" }}>
        <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-start gap-9 md:grid-cols-[.85fr_1.15fr]">
          <div>
            <div style={{ fontSize: 11.5, letterSpacing: ".3em", textTransform: "uppercase", color: "#d8b878", marginBottom: 16 }}>{t.svcFaq.kicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(30px,4.4vw,46px)", lineHeight: 1.1, color: "#fff8ec", margin: 0 }}>{t.svcFaq.title}</h2>
          </div>
          <div className="flex flex-col">
            {t.svcFaq.items.map((f) => (
              <div key={f.q} style={{ padding: "22px 0", borderBottom: "1px solid rgba(209,176,105,.2)" }}>
                <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 19, color: "#fff8ec", margin: "0 0 8px" }}>{f.q}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "rgba(236,220,192,.66)", margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#d1b069", padding: "clamp(56px,7vw,88px) 28px", textAlign: "center" }}>
        <div className="mx-auto max-w-[660px]">
          <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(28px,4vw,42px)", color: "#14283f", margin: "0 0 28px", lineHeight: 1.14 }}>{t.services.ctaTitle}</h2>
          <Link href="/find" className="au-btn-navy">{t.find.submit}</Link>
        </div>
      </section>
    </>
  );
}
