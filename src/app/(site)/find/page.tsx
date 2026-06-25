"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { formatUSPhone, isValidEmail, isValidUSPhone } from "@/lib/format";
import { useRecaptcha } from "@/hooks/use-recaptcha";
import { Conversions } from "@/lib/analytics";

type Errors = Partial<Record<string, string>>;

export default function FindPage() {
  const { t, lang } = useI18n();
  const recaptcha = useRecaptcha();
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", location: "", services: [] as string[],
    frequency: "", budget: "", startDate: "", notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const toggleService = (val: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(val)
        ? f.services.filter((s) => s !== val)
        : [...f.services, val],
    }));

  const validate = (): boolean => {
    const e: Errors = {};
    if (form.fullName.trim().length < 2) e.fullName = t.err.name;
    if (!isValidUSPhone(form.phone)) e.phone = t.err.phone;
    if (!isValidEmail(form.email)) e.email = t.err.email;
    if (!form.location) e.location = t.err.required;
    if (form.services.length === 0) e.services = t.err.services;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const recaptchaToken = await recaptcha("employer_lead");
      const res = await fetch("/api/leads/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale: lang, recaptchaToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors(data.issues ? flatten(data.issues) : { _form: t.err.generic });
        return;
      }
      Conversions.employerLead();
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
      <Success
        title={t.find.success.title}
        body={t.find.success.body}
        cta={t.find.success.cta}
      />
    );
  }

  return (
    <>
      {/* Hero */}
      <section style={{ background: "radial-gradient(130% 100% at 50% -24%, #fff8ee 0%, #ecd9b2 72%)", padding: "clamp(72px,9vw,116px) 28px clamp(40px,5vw,64px)" }}>
        <div className="mx-auto max-w-[760px] text-center">
          <div className="au-enter au-kicker" style={{ marginBottom: 22 }}>{t.find.kicker}</div>
          <h1 className="au-enter au-serif" style={{ fontWeight: 500, fontSize: "clamp(40px,6vw,68px)", lineHeight: 1.05, color: "#1c3a5e", margin: "0 0 22px", animationDelay: ".14s" }}>{t.find.title}</h1>
          <p className="au-enter" style={{ maxWidth: 520, margin: "0 auto", fontSize: "clamp(15px,1.8vw,17.5px)", lineHeight: 1.7, color: "rgba(54,41,26,.7)", animationDelay: ".24s" }}>{t.find.sub}</p>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: "clamp(20px,3vw,40px) 28px clamp(48px,6vw,80px)" }}>
        <div className="mx-auto max-w-[760px]" style={{ background: "#fffaf2", border: "1px solid rgba(54,41,26,.1)", padding: "clamp(30px,4vw,52px)" }}>
          <div className="flex flex-col gap-[22px]">
            <Field label={t.find.labels.name} required error={errors.fullName}>
              <input className="au-input" value={form.fullName} placeholder={t.find.ph.name} onChange={(e) => set("fullName", e.target.value)} />
            </Field>

            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
              <Field label={t.find.labels.phone} required error={errors.phone}>
                <input className="au-input" value={form.phone} inputMode="tel" placeholder={t.find.ph.phone} onChange={(e) => set("phone", formatUSPhone(e.target.value))} />
              </Field>
              <Field label={t.find.labels.email} required error={errors.email}>
                <input className="au-input" value={form.email} inputMode="email" placeholder={t.find.ph.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
            </div>

            <Field label={t.find.labels.location} required error={errors.location}>
              <select className="au-input" value={form.location} onChange={(e) => set("location", e.target.value)} style={{ appearance: "none", cursor: "pointer" }}>
                <option value="">{t.find.locationPh}</option>
                {t.find.locationOpts.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            <Field label={t.find.labels.services} required error={errors.services}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {t.find.serviceOpts.map((o) => {
                  const checked = form.services.includes(o.value);
                  return (
                    <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer", border: `1px solid ${checked ? "#b1812f" : "rgba(54,41,26,.16)"}`, background: checked ? "rgba(177,129,47,.08)" : "#fdf7ec", borderRadius: 2, padding: "12px 14px", fontSize: 14, color: "#36291a" }}>
                      <input type="checkbox" checked={checked} onChange={() => toggleService(o.value)} style={{ width: 17, height: 17, accentColor: "#b1812f" }} />
                      {o.label}
                    </label>
                  );
                })}
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
              <Field label={`${t.find.labels.freq} · ${t.find.optional}`}>
                <select className="au-input" value={form.frequency} onChange={(e) => set("frequency", e.target.value)} style={{ appearance: "none", cursor: "pointer" }}>
                  {t.find.freqOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label={`${t.find.labels.budget} · ${t.find.optional}`}>
                <select className="au-input" value={form.budget} onChange={(e) => set("budget", e.target.value)} style={{ appearance: "none", cursor: "pointer" }}>
                  {t.find.budgetOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label={`${t.find.labels.start} · ${t.find.optional}`}>
              <input className="au-input" type="date" value={form.startDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => set("startDate", e.target.value)} />
            </Field>

            <Field label={`${t.find.labels.notes} · ${t.find.optional}`}>
              <textarea className="au-input" rows={4} maxLength={500} value={form.notes} placeholder={t.find.ph.notes} onChange={(e) => set("notes", e.target.value)} style={{ resize: "vertical" }} />
            </Field>

            {errors._form && <div className="au-err">{errors._form}</div>}

            <button className="au-btn-gold" disabled={submitting} onClick={submit} style={{ marginTop: 6 }}>
              {submitting ? "…" : t.find.submit}
            </button>
          </div>
        </div>

        {/* Prefer to talk */}
        <div className="mx-auto mt-6 flex max-w-[760px] flex-wrap items-center justify-between gap-5" style={{ background: "radial-gradient(130% 130% at 12% 0%, #21405f 0%, #14283f 70%)", border: "1px solid rgba(209,176,105,.28)", padding: "clamp(28px,3.5vw,44px)" }}>
          <div style={{ maxWidth: 460 }}>
            <div style={{ fontSize: 11.5, letterSpacing: ".3em", textTransform: "uppercase", color: "#d8b878", marginBottom: 12 }}>{t.find.matchKicker}</div>
            <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(24px,3vw,32px)", lineHeight: 1.14, color: "#fff8ec", margin: "0 0 10px" }}>{t.find.matchTitle}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(236,220,192,.66)", margin: 0 }}>{t.find.matchSub}</p>
          </div>
          <Link href="/book" className="au-btn-gold">{t.find.matchCta} →</Link>
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

function Success({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <section style={{ padding: "clamp(72px,9vw,120px) 28px" }}>
      <div className="mx-auto max-w-[680px]" style={{ background: "radial-gradient(120% 130% at 50% -10%, #21405f 0%, #14283f 60%)", color: "#ecdcc0", padding: "clamp(44px,5vw,68px) clamp(30px,4vw,52px)", textAlign: "center", border: "1px solid rgba(209,176,105,.32)" }}>
        <div style={{ width: 62, height: 62, border: "1px solid #d8b878", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 26, color: "#d8b878" }}>✓</div>
        <h2 className="au-serif" style={{ fontWeight: 500, fontSize: "clamp(30px,4.2vw,44px)", color: "#fff8ec", margin: "0 0 16px" }}>{title}</h2>
        <p style={{ maxWidth: 420, margin: "0 auto 30px", fontSize: 15, lineHeight: 1.7, color: "rgba(236,220,192,.7)" }}>{body}</p>
        <Link href="/" className="au-btn-gold" style={{ background: "#d1b069", color: "#14283f" }}>{cta}</Link>
      </div>
    </section>
  );
}

function flatten(issues: Record<string, string[]>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(issues)) out[k] = v[0];
  return out;
}
