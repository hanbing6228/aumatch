"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { Sprig } from "@/components/sprig";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      {/* ───── Hero ───── */}
      <section style={{ background: "radial-gradient(130% 100% at 50% -12%, #fff8ee 0%, #efdfc0 64%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent 0 55px,rgba(28,58,94,.04) 55px 56px)", pointerEvents: "none" }} />
        <Image src="/assets/logo.png" alt="" width={680} height={680} aria-hidden style={{ position: "absolute", left: "50%", top: "11%", transform: "translateX(-50%)", height: "clamp(360px,52vw,680px)", width: "auto", opacity: 0.07, pointerEvents: "none", animation: "auFloat 9s ease-in-out infinite" }} />
        <div className="relative mx-auto max-w-[1040px] px-7 text-center" style={{ padding: "118px 28px 92px" }}>
          <div className="au-enter" style={{ fontSize: 12, letterSpacing: ".34em", textTransform: "uppercase", color: "#b1812f", marginBottom: 30, animationDelay: ".05s" }}>
            {t.hero.kicker}
          </div>
          <h1
            className="au-enter au-serif"
            style={{
              fontWeight: 500, fontSize: "clamp(54px,8.6vw,108px)", lineHeight: 1, margin: 0, letterSpacing: ".5px",
              background: "linear-gradient(100deg,#9a6f28 0%,#e8c878 22%,#1c3a5e 50%,#e8c878 78%,#9a6f28 100%)",
              backgroundSize: "200% auto", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent",
              animation: "auFadeUp .9s cubic-bezier(.2,.7,.2,1) forwards, auShimmer 8s linear infinite", animationDelay: ".16s,1s",
            }}
          >
            {t.hero.title}
          </h1>
          <div className="au-enter" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "32px 0", animationDelay: ".28s" }}>
            <span style={{ width: 48, height: 1, background: "linear-gradient(90deg,transparent,#b1812f)" }} />
            <Sprig className="au-sway" />
            <span style={{ width: 48, height: 1, background: "linear-gradient(90deg,#b1812f,transparent)" }} />
          </div>
          <p className="au-enter" style={{ maxWidth: 600, margin: "0 auto", fontSize: "clamp(16px,2vw,19px)", lineHeight: 1.66, color: "rgba(54,41,26,.66)", animationDelay: ".36s" }}>
            {t.hero.sub}
          </p>
          <div className="au-enter" style={{ display: "flex", gap: 15, justifyContent: "center", flexWrap: "wrap", marginTop: 44, animationDelay: ".46s" }}>
            <Link href="/find" className="au-btn-gold au-cta-glow">{t.hero.ctaPrimary}</Link>
            <Link href="/join" className="au-btn-outline">{t.hero.ctaSecondary}</Link>
          </div>
        </div>
        {/* Trust strip */}
        <div style={{ position: "relative", borderTop: "1px solid rgba(177,129,47,.25)", background: "#ecd9b2" }}>
          <div className="mx-auto flex max-w-[1100px] flex-wrap justify-center gap-x-10 gap-y-[14px] px-7" style={{ padding: "20px 28px" }}>
            {t.trust.items.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 12.5, letterSpacing: ".08em", color: "rgba(28,58,94,.78)", textTransform: "uppercase" }}>
                <span style={{ color: "#b1812f", fontSize: 9 }}>◆</span>
                {b.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Advantages ───── */}
      <section style={{ padding: "clamp(66px,9vw,116px) 28px" }}>
        <div className="mx-auto max-w-content">
          <div className="mb-[54px] text-center">
            <div className="au-kicker mb-4">{t.adv.kicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(32px,4.6vw,50px)", lineHeight: 1.08, color: "#36291a", margin: 0 }}>{t.adv.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-px md:grid-cols-3" style={{ background: "rgba(54,41,26,.1)", border: "1px solid rgba(54,41,26,.1)" }}>
            {t.adv.items.map((item) => (
              <div key={item.num} style={{ background: "#fffaf2", padding: "clamp(34px,3.6vw,48px) clamp(28px,3vw,40px)" }}>
                <div className="au-serif" style={{ fontSize: 42, color: "#b1812f", lineHeight: 1, marginBottom: 24 }}>{item.num}</div>
                <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 25, color: "#1c3a5e", margin: "0 0 14px" }}>{item.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#6f6450", margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Services (navy) ───── */}
      <section style={{ background: "radial-gradient(120% 120% at 50% -20%, #21405f 0%, #14283f 62%)", backgroundSize: "160% 160%", color: "#ecdcc0", padding: "clamp(66px,9vw,116px) 28px", position: "relative", overflow: "hidden", animation: "auDrift 18s ease-in-out infinite" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent 0 55px,rgba(209,176,105,.05) 55px 56px)", pointerEvents: "none" }} />
        <div className="relative mx-auto max-w-content">
          <div className="mb-12 max-w-[640px]">
            <div style={{ fontSize: 11.5, letterSpacing: ".3em", textTransform: "uppercase", color: "#d8b878", marginBottom: 16 }}>{t.svc.kicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(32px,4.6vw,50px)", lineHeight: 1.08, color: "#fff8ec", margin: "0 0 16px" }}>{t.svc.title}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(236,220,192,.66)", margin: 0 }}>{t.svc.sub}</p>
          </div>
          <div className="grid grid-cols-1 gap-[22px] md:grid-cols-3">
            {t.svc.cards.map((item, i) => (
              <Link key={i} href="/services" className="flex flex-col" style={{ textAlign: "left", background: "rgba(236,220,192,.04)", border: "1px solid rgba(209,176,105,.24)", padding: "38px 32px 32px", minHeight: 264, transition: "all .28s" }}>
                <Sprig width={22} height={35} color="#d8b878" style={{ marginBottom: 22 }} />
                <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 24, color: "#fff8ec", margin: "0 0 10px" }}>{item.name}</h3>
                <div style={{ fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#d8b878", marginBottom: 16 }}>{item.scope}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "rgba(236,220,192,.66)", margin: "0 0 auto" }}>{item.body}</p>
                <span style={{ marginTop: 24, fontSize: 13, letterSpacing: ".04em", color: "#d8b878" }}>{t.svc.cardCta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section style={{ padding: "clamp(66px,9vw,116px) 28px" }}>
        <div className="mx-auto max-w-content">
          <div className="mb-[52px] text-center">
            <div className="au-kicker mb-4">{t.testi.kicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(32px,4.6vw,50px)", lineHeight: 1.08, color: "#36291a", margin: 0 }}>{t.testi.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-[22px] md:grid-cols-3">
            {t.testi.items.map((item, i) => (
              <figure key={i} className="flex flex-col" style={{ background: "#fffaf2", border: "1px solid rgba(54,41,26,.09)", padding: "38px 34px", margin: 0 }}>
                <div className="au-serif" style={{ fontSize: 56, color: "#ddca84", lineHeight: 0.6, height: 30 }}>“</div>
                <blockquote className="au-serif" style={{ fontSize: 21, lineHeight: 1.42, color: "#1c3a5e", margin: "0 0 auto", fontStyle: "italic" }}>{item.quote}</blockquote>
                <figcaption style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid rgba(54,41,26,.1)" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#36291a" }}>{item.author}</div>
                  <div style={{ fontSize: 12.5, letterSpacing: ".04em", color: "#94866c", marginTop: 3 }}>{item.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Home CTA ───── */}
      <section style={{ background: "#d1b069", padding: "clamp(60px,8vw,96px) 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent 0 55px,rgba(28,58,94,.05) 55px 56px)", pointerEvents: "none" }} />
        <div className="relative mx-auto max-w-[720px]">
          <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(30px,4.4vw,46px)", color: "#14283f", margin: "0 0 18px", lineHeight: 1.12 }}>{t.homeCta.title}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(20,40,63,.72)", margin: "0 0 34px" }}>{t.homeCta.sub}</p>
          <div className="flex flex-wrap justify-center gap-[15px]">
            <Link href="/find" className="au-btn-navy">{t.hero.ctaPrimary}</Link>
            <Link href="/join" className="au-btn-outline" style={{ color: "#14283f", borderColor: "rgba(20,40,63,.45)" }}>{t.hero.ctaSecondary}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
