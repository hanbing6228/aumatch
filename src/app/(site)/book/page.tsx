"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { isValidEmail } from "@/lib/format";
import { CalendlyEmbed } from "@/components/calendly-embed";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

export default function BookPage() {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", topic: "" });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 2) e.fullName = t.err.name;
    if (!isValidEmail(form.email)) e.email = t.err.email;
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale: lang }),
      });
      if (!res.ok) { setErrors({ _form: t.err.generic }); return; }
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ _form: t.err.generic });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section style={{ background: "radial-gradient(130% 100% at 50% -24%, #fff8ee 0%, #ecd9b2 72%)", padding: "clamp(72px,9vw,108px) 28px clamp(50px,6vw,76px)", position: "relative", overflow: "hidden" }}>
        <Image src="/assets/logo.png" alt="" width={420} height={420} aria-hidden style={{ position: "absolute", right: "-2%", top: "-10%", height: "clamp(240px,32vw,420px)", width: "auto", opacity: 0.07, pointerEvents: "none", animation: "auFloat 10s ease-in-out infinite" }} />
        <div className="relative mx-auto max-w-[760px] text-center">
          <div className="au-enter au-kicker" style={{ marginBottom: 22 }}>{t.book.kicker}</div>
          <h1 className="au-enter au-serif" style={{ fontWeight: 500, fontSize: "clamp(40px,6vw,68px)", lineHeight: 1.05, color: "#1c3a5e", margin: "0 0 22px", animationDelay: ".14s" }}>{t.book.title}</h1>
          <p className="au-enter" style={{ maxWidth: 560, margin: "0 auto", fontSize: "clamp(15px,1.8vw,17.5px)", lineHeight: 1.7, color: "rgba(54,41,26,.7)", animationDelay: ".24s" }}>{t.book.sub}</p>
        </div>
      </section>

      <section style={{ padding: "clamp(40px,5vw,64px) 28px clamp(70px,9vw,116px)" }}>
        {done ? (
          <div className="mx-auto max-w-[680px]" style={{ background: "radial-gradient(120% 130% at 50% -10%, #21405f 0%, #14283f 60%)", color: "#ecdcc0", padding: "clamp(44px,5vw,68px) clamp(30px,4vw,52px)", textAlign: "center", border: "1px solid rgba(209,176,105,.32)" }}>
            <div style={{ width: 62, height: 62, border: "1px solid #d8b878", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 26, color: "#d8b878" }}>✓</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(30px,4.2vw,44px)", color: "#fff8ec", margin: "0 0 16px" }}>{t.book.success.title}</h2>
            <p style={{ maxWidth: 420, margin: "0 auto 30px", fontSize: 15, lineHeight: 1.7, color: "rgba(236,220,192,.7)" }}>{t.book.success.body}</p>
            <Link href="/" className="au-btn-gold" style={{ background: "#d1b069", color: "#14283f" }}>{t.book.success.cta}</Link>
          </div>
        ) : (
          <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-start gap-6 lg:grid-cols-[1.05fr_.95fr]">
            {/* Left: scheduler (Calendly) or in-app form */}
            <div className="flex flex-col gap-5">
              {CALENDLY_URL ? (
                <CalendlyEmbed url={CALENDLY_URL} prefill={{ name: form.fullName, email: form.email }} />
              ) : (
                <div style={{ background: "#fffaf2", border: "1px solid rgba(54,41,26,.1)", padding: "clamp(26px,3.4vw,40px)" }}>
                  <div style={{ fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#897c64", marginBottom: 18 }}>{t.book.stepDetails}</div>
                  <div className="flex flex-col gap-[18px]">
                    <div>
                      <label className="au-label">{t.book.nameL} <span style={{ color: "#b1812f" }}>*</span></label>
                      <input className="au-input" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                      {errors.fullName && <div className="au-err">{errors.fullName}</div>}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="au-label">{t.book.emailL} <span style={{ color: "#b1812f" }}>*</span></label>
                        <input className="au-input" inputMode="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                        {errors.email && <div className="au-err">{errors.email}</div>}
                      </div>
                      <div>
                        <label className="au-label">{t.book.phoneL}</label>
                        <input className="au-input" inputMode="tel" placeholder="919-555-0100" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="au-label">{t.book.topicL}</label>
                      <select className="au-input" value={form.topic} onChange={(e) => set("topic", e.target.value)} style={{ appearance: "none", cursor: "pointer" }}>
                        {t.book.topicOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    {errors._form && <div className="au-err">{errors._form}</div>}
                    <button className="au-btn-gold" disabled={submitting} onClick={submit}>{submitting ? "…" : t.book.confirm}</button>
                  </div>
                </div>
              )}

              {/* Reassurance */}
              <div style={{ background: "#fffaf2", border: "1px solid rgba(54,41,26,.09)", padding: "clamp(22px,2.6vw,30px)", display: "flex", flexWrap: "wrap", gap: "14px 28px" }}>
                {t.book.reassure.map((r) => (
                  <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, lineHeight: 1.5, color: "#36291a" }}>
                    <span style={{ color: "#1c8a5b", fontSize: 13, marginTop: 2 }}>✓</span>{r}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: contact info */}
            <div className="lg:sticky lg:top-[100px]" style={{ background: "#1c3a5e", color: "#ecdcc0", padding: "clamp(26px,3vw,34px)" }}>
              <div style={{ fontSize: 11.5, letterSpacing: ".3em", textTransform: "uppercase", color: "#d8b878", marginBottom: 24 }}>{t.book.infoTitle}</div>
              <div className="flex flex-col gap-6">
                <InfoRow label={t.book.emailL}>
                  <a href="mailto:info@aumatch.com" style={{ fontSize: 15.5, color: "#fff8ec", textDecoration: "none", borderBottom: "1px solid rgba(209,176,105,.4)", paddingBottom: 2 }}>{t.book.emailV}</a>
                </InfoRow>
                <InfoRow label={t.book.phoneL}><span style={{ fontSize: 15.5, color: "#fff8ec" }}>{t.book.phoneV}</span></InfoRow>
                <InfoRow label={t.book.hoursLabel}><span style={{ fontSize: 14.5, color: "rgba(236,220,192,.85)" }}>{t.book.hoursV}</span></InfoRow>
                <InfoRow label={t.book.addrLabel}><span style={{ fontSize: 14.5, color: "rgba(236,220,192,.85)" }}>{t.book.addrV}</span></InfoRow>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(236,220,192,.55)", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
