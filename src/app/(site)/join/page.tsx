"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { formatUSPhone, isValidEmail, isValidUSPhone } from "@/lib/format";

type Errors = Partial<Record<string, string>>;
const MAX_FILE = 5 * 1024 * 1024; // 5 MB

export default function JoinPage() {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", city: "", availability: "",
    expectedRate: "", consentBgCheck: false,
  });
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE) {
      setErrors((er) => ({ ...er, file: t.err.fileSize }));
      setFileName("");
      return;
    }
    setErrors((er) => ({ ...er, file: undefined }));
    setFileName(f.name);
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (form.fullName.trim().length < 2) e.fullName = t.err.name;
    if (!isValidUSPhone(form.phone)) e.phone = t.err.phone;
    if (!isValidEmail(form.email)) e.email = t.err.email;
    if (form.city.trim().length < 2) e.city = t.err.required;
    if (!form.consentBgCheck) e.consent = t.err.consent;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads/provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, documentName: fileName, locale: lang }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors({ _form: t.err.generic, ...(data.issues ? {} : {}) });
        return;
      }
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ _form: t.err.generic });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section style={{ padding: "clamp(72px,9vw,120px) 28px" }}>
        <div className="mx-auto max-w-[680px]" style={{ background: "radial-gradient(120% 130% at 50% -10%, #21405f 0%, #14283f 60%)", color: "#ecdcc0", padding: "clamp(44px,5vw,64px) clamp(30px,4vw,48px)", textAlign: "center", border: "1px solid rgba(209,176,105,.32)" }}>
          <div className="au-serif" style={{ width: 60, height: 60, border: "1px solid #d8b878", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 26px", fontSize: 30, color: "#d8b878" }}>Au</div>
          <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(28px,4vw,40px)", color: "#fff8ec", margin: "0 0 16px" }}>{t.join.success.title}</h2>
          <p style={{ maxWidth: 420, margin: "0 auto 30px", fontSize: 15.5, lineHeight: 1.7, color: "rgba(236,220,192,.7)" }}>{t.join.success.body}</p>
          <Link href="/" className="au-btn-gold" style={{ background: "#d1b069", color: "#14283f" }}>{t.join.success.cta}</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section style={{ background: "radial-gradient(130% 100% at 50% -24%, #fff8ee 0%, #ecd9b2 72%)", padding: "clamp(72px,9vw,116px) 28px clamp(56px,7vw,88px)" }}>
        <div className="mx-auto max-w-[760px] text-center">
          <div className="au-enter au-kicker" style={{ marginBottom: 22 }}>{t.join.kicker}</div>
          <h1 className="au-enter au-serif" style={{ fontWeight: 500, fontSize: "clamp(40px,6vw,68px)", lineHeight: 1.05, color: "#1c3a5e", margin: "0 0 22px", animationDelay: ".14s" }}>{t.join.title}</h1>
          <p className="au-enter" style={{ maxWidth: 540, margin: "0 auto", fontSize: "clamp(15px,1.8vw,17.5px)", lineHeight: 1.7, color: "rgba(54,41,26,.7)", animationDelay: ".24s" }}>{t.join.sub}</p>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "clamp(54px,7vw,92px) 28px clamp(20px,3vw,36px)" }}>
        <div className="mx-auto max-w-[1140px]">
          <div className="mb-12 text-center">
            <div className="au-kicker mb-4">{t.join.benefitsKicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(30px,4.4vw,46px)", lineHeight: 1.1, color: "#36291a", margin: 0 }}>{t.join.benefitsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-px md:grid-cols-3" style={{ background: "rgba(54,41,26,.1)", border: "1px solid rgba(54,41,26,.1)" }}>
            {t.join.benefits.map((w) => (
              <div key={w.title} style={{ background: "#fffaf2", padding: "34px 30px" }}>
                <span style={{ color: "#b1812f", fontSize: 11 }}>◆</span>
                <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 21, color: "#1c3a5e", margin: "14px 0 10px" }}>{w.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "#6f6450", margin: 0 }}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding */}
      <section style={{ padding: "clamp(40px,5vw,68px) 28px" }}>
        <div className="mx-auto max-w-[1140px]">
          <div className="mb-10 max-w-[560px]">
            <div className="au-kicker mb-4">{t.join.onboardKicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(28px,4vw,42px)", lineHeight: 1.1, color: "#36291a", margin: 0 }}>{t.join.onboardTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 md:grid-cols-4" style={{ background: "rgba(54,41,26,.1)", border: "1px solid rgba(54,41,26,.1)" }}>
            {t.join.onboard.map((step) => (
              <div key={step.n} style={{ background: "#fffaf2", padding: "32px 26px 36px" }}>
                <div className="au-serif" style={{ fontSize: 34, color: "#b1812f", lineHeight: 1, marginBottom: 18 }}>{step.n}</div>
                <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 20, color: "#1c3a5e", margin: "0 0 10px" }}>{step.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.62, color: "#6f6450", margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section style={{ padding: "clamp(16px,3vw,40px) 28px clamp(40px,5vw,64px)" }}>
        <div className="mx-auto max-w-[900px]" style={{ background: "#1c3a5e", border: "1px solid rgba(209,176,105,.3)", padding: "clamp(36px,5vw,56px)", textAlign: "center" }}>
          <div className="au-serif" style={{ fontSize: 52, color: "#d8b878", lineHeight: 0.5, height: 24 }}>“</div>
          <blockquote className="au-serif" style={{ fontStyle: "italic", fontSize: "clamp(22px,3vw,30px)", lineHeight: 1.4, color: "#fff8ec", margin: "0 auto 22px", maxWidth: 680 }}>{t.join.quote.quote}</blockquote>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#d8b878" }}>{t.join.quote.author}</div>
          <div style={{ fontSize: 12.5, letterSpacing: ".04em", color: "rgba(236,220,192,.6)", marginTop: 4 }}>{t.join.quote.role}</div>
        </div>
      </section>

      {/* Compliance + form */}
      <section style={{ padding: "clamp(44px,5vw,72px) 28px clamp(70px,9vw,116px)" }}>
        <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-start gap-8 md:grid-cols-[.9fr_1.1fr]">
          <div className="md:sticky md:top-[100px]">
            <div className="au-kicker mb-4">{t.join.compliance.kicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(28px,3.6vw,40px)", lineHeight: 1.1, color: "#36291a", margin: "0 0 18px" }}>{t.join.compliance.title}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.76, color: "#6f6450", margin: 0 }}>{t.join.compliance.body}</p>
          </div>

          <div style={{ background: "#fffaf2", border: "1px solid rgba(54,41,26,.1)", padding: "clamp(30px,4vw,48px)" }}>
            <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 26, color: "#1c3a5e", margin: "0 0 28px" }}>{t.join.formTitle}</h3>
            <div className="flex flex-col gap-[22px]">
              <Field label={t.join.labels.name} required error={errors.fullName}>
                <input className="au-input" value={form.fullName} placeholder={t.join.ph.name} onChange={(e) => set("fullName", e.target.value)} />
              </Field>
              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                <Field label={t.join.labels.phone} required error={errors.phone}>
                  <input className="au-input" value={form.phone} inputMode="tel" placeholder={t.join.ph.phone} onChange={(e) => set("phone", formatUSPhone(e.target.value))} />
                </Field>
                <Field label={t.join.labels.email} required error={errors.email}>
                  <input className="au-input" value={form.email} inputMode="email" placeholder={t.join.ph.email} onChange={(e) => set("email", e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                <Field label={t.join.labels.city} required error={errors.city}>
                  <input className="au-input" value={form.city} placeholder={t.join.ph.city} onChange={(e) => set("city", e.target.value)} />
                </Field>
                <Field label={t.join.labels.avail}>
                  <select className="au-input" value={form.availability} onChange={(e) => set("availability", e.target.value)} style={{ appearance: "none", cursor: "pointer" }}>
                    {t.join.availOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
              </div>
              <Field label={t.join.labels.rate}>
                <input className="au-input" value={form.expectedRate} placeholder={t.join.ph.rate} onChange={(e) => set("expectedRate", e.target.value)} />
              </Field>
              <Field label={t.join.labels.file} error={errors.file}>
                <label style={{ display: "flex", alignItems: "center", gap: 14, border: "1px dashed rgba(177,129,47,.5)", borderRadius: 2, padding: "16px 18px", cursor: "pointer", background: "#f7ecda" }}>
                  <span style={{ background: "#b1812f", color: "#fff8ec", fontSize: 12.5, letterSpacing: ".04em", padding: "9px 16px", borderRadius: 2, whiteSpace: "nowrap" }}>{t.join.fileBtn}</span>
                  <span style={{ fontSize: 13.5, color: "#6f6450", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fileName || t.join.fileNone}</span>
                  <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={onFile} style={{ display: "none" }} />
                </label>
                <div style={{ fontSize: 12.5, color: "#b7a886", marginTop: 8 }}>{t.join.fileNote}</div>
              </Field>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 13, cursor: "pointer", paddingTop: 4 }}>
                <input type="checkbox" checked={form.consentBgCheck} onChange={(e) => set("consentBgCheck", e.target.checked)} style={{ width: 18, height: 18, accentColor: "#b1812f", marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "#5a513f" }}>{t.join.consentLabel} <span style={{ color: "#b1812f" }}>*</span></span>
              </label>
              {errors.consent && <div className="au-err" style={{ marginTop: -12 }}>{errors.consent}</div>}
              {errors._form && <div className="au-err">{errors._form}</div>}
              <button className="au-btn-gold" disabled={submitting} onClick={submit} style={{ marginTop: 6 }}>
                {submitting ? "…" : t.join.submit}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="au-label">
        {label} {required && <span style={{ color: "#b1812f" }}>*</span>}
      </label>
      {children}
      {error && <div className="au-err">{error}</div>}
    </div>
  );
}
