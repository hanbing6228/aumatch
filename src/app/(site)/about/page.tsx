"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      {/* Story hero */}
      <section style={{ background: "radial-gradient(130% 100% at 50% -16%, #fff8ee 0%, #ecd9b2 70%)", position: "relative", overflow: "hidden", padding: "clamp(80px,10vw,128px) 28px clamp(70px,9vw,112px)" }}>
        <Image src="/assets/logo.png" alt="" width={560} height={560} aria-hidden style={{ position: "absolute", right: "-3%", top: "-4%", height: "clamp(300px,42vw,560px)", width: "auto", opacity: 0.09, pointerEvents: "none", animation: "auFloat 10s ease-in-out infinite" }} />
        <div className="relative mx-auto max-w-[880px]">
          <div className="au-enter au-kicker" style={{ marginBottom: 22, animationDelay: ".05s" }}>{t.about.storyKicker}</div>
          <h1 className="au-enter au-serif" style={{ fontWeight: 500, fontSize: "clamp(40px,6vw,72px)", lineHeight: 1.04, color: "#1c3a5e", margin: "0 0 36px", animationDelay: ".14s" }}>{t.about.storyTitle}</h1>
          {t.about.storyBody.map((para, i) => (
            <p key={i} style={{ maxWidth: 640, fontSize: "clamp(16px,1.9vw,18.5px)", lineHeight: 1.78, color: "rgba(54,41,26,.72)", margin: "0 0 22px" }}>{para}</p>
          ))}
        </div>
      </section>

      {/* Promise + areas */}
      <section style={{ padding: "clamp(62px,8vw,104px) 28px" }}>
        <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-start gap-9 md:grid-cols-[1fr_1.25fr]">
          <div>
            <div className="au-kicker mb-[18px]">{t.about.promiseKicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(30px,4.2vw,44px)", lineHeight: 1.1, color: "#36291a", margin: "0 0 18px" }}>{t.about.promiseTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.74, color: "#6f6450", margin: 0 }}>{t.about.promiseBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-px" style={{ background: "rgba(54,41,26,.1)", border: "1px solid rgba(54,41,26,.1)" }}>
            {t.about.areas.map((area) => (
              <div key={area} style={{ background: "#fffaf2", padding: "22px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#b1812f", fontSize: 9 }}>◆</span>
                <span style={{ fontSize: 15, letterSpacing: ".02em", color: "#1c3a5e" }}>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process (navy) */}
      <section style={{ background: "radial-gradient(120% 120% at 50% -20%, #21405f 0%, #14283f 62%)", color: "#ecdcc0", padding: "clamp(64px,8vw,108px) 28px" }}>
        <div className="mx-auto max-w-content">
          <div className="mb-14 text-center">
            <div style={{ fontSize: 11.5, letterSpacing: ".3em", textTransform: "uppercase", color: "#d8b878", marginBottom: 16 }}>{t.about.processKicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(32px,4.6vw,50px)", color: "#fff8ec", margin: 0 }}>{t.about.processTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 md:grid-cols-4" style={{ background: "rgba(209,176,105,.24)", border: "1px solid rgba(209,176,105,.24)" }}>
            {t.about.steps.map((step) => (
              <div key={step.n} style={{ background: "#14283f", padding: "38px 28px 40px" }}>
                <div className="au-serif" style={{ fontSize: 36, color: "#d8b878", lineHeight: 1, marginBottom: 20 }}>{step.n}</div>
                <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 22, color: "#fff8ec", margin: "0 0 12px" }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(236,220,192,.64)", margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section style={{ padding: "clamp(64px,8vw,108px) 28px" }}>
        <div className="mx-auto grid max-w-[1140px] grid-cols-1 gap-7 md:grid-cols-2">
          <div style={{ background: "#fffaf2", border: "1px solid rgba(54,41,26,.09)", borderTop: "3px solid #b1812f", padding: "clamp(34px,4vw,52px)" }}>
            <div className="au-kicker mb-[18px]">{t.mission.label}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(26px,3.4vw,38px)", lineHeight: 1.12, color: "#1c3a5e", margin: "0 0 24px" }}>{t.mission.title}</h2>
            <div className="mb-6 flex flex-col gap-[18px]">
              {t.mission.points.map((p, i) => (
                <div key={i} className="flex gap-[14px]">
                  <span style={{ color: "#b1812f", fontSize: 9, marginTop: 7 }}>◆</span>
                  <div>
                    <div className="au-serif" style={{ fontWeight: 600, fontSize: 17, color: "#1c3a5e", marginBottom: 5 }}>{p.t}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.68, color: "#6f6450", margin: 0 }}>{p.b}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#36291a", margin: 0, paddingTop: 20, borderTop: "1px solid rgba(54,41,26,.1)", fontStyle: "italic" }}>{t.mission.closing}</p>
          </div>
          <div style={{ background: "#1c3a5e", border: "1px solid rgba(28,58,94,.5)", borderTop: "3px solid #d8b878", padding: "clamp(34px,4vw,52px)" }}>
            <div style={{ fontSize: 11.5, letterSpacing: ".3em", textTransform: "uppercase", color: "#d8b878", marginBottom: 18 }}>{t.vision.label}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(26px,3.4vw,38px)", lineHeight: 1.12, color: "#fff8ec", margin: "0 0 18px" }}>{t.vision.title}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.76, color: "rgba(236,220,192,.72)", margin: 0 }}>{t.vision.body}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "0 28px clamp(72px,9vw,116px)" }}>
        <div className="mx-auto max-w-[1140px]">
          <div className="mb-[46px] text-center">
            <div className="au-kicker mb-4">{t.values.kicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(30px,4.4vw,46px)", lineHeight: 1.1, color: "#36291a", margin: 0 }}>{t.values.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-px md:grid-cols-3" style={{ background: "rgba(54,41,26,.1)", border: "1px solid rgba(54,41,26,.1)" }}>
            {t.values.items.map((v) => (
              <div key={v.title} style={{ background: "#f7ecda", padding: "clamp(32px,3.4vw,44px) clamp(28px,3vw,38px)" }}>
                <span style={{ color: "#b1812f", fontSize: 11 }}>◆</span>
                <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 23, color: "#1c3a5e", margin: "14px 0 12px" }}>{v.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#6f6450", margin: 0 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
