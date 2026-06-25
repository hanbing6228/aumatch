"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { isValidEmail } from "@/lib/format";
import { Conversions } from "@/lib/analytics";

// Curated 30-minute slots (Mon–Fri), mirroring the design's time grid.
const SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM",
  "10:30 AM", "11:00 AM", "1:00 PM",
  "1:30 PM", "2:00 PM", "3:00 PM",
];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function BookingCalendar({ onDone }: { onDone: () => void }) {
  const { t, lang } = useI18n();
  const today = startOfToday();

  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selDate, setSelDate] = useState<Date | null>(null);
  const [selTime, setSelTime] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", topic: "" });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const offset = first.getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(view.y, view.m, d));
    return out;
  }, [view]);

  const atCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();

  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
  const isPast = (d: Date) => d < today;
  const sameDay = (a: Date | null, b: Date | null) =>
    !!a && !!b && a.toDateString() === b.toDateString();

  const slotsForDay = selDate && !isWeekend(selDate) ? SLOTS : [];

  const monthLabel = `${t.book.months[view.m]} ${view.y}`;

  const prev = () => {
    if (atCurrentMonth) return;
    setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }));
  };
  const next = () =>
    setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }));

  const confirm = async () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 2) e.fullName = t.err.name;
    if (!isValidEmail(form.email)) e.email = t.err.email;
    if (!selDate) e.date = t.book.pickDayFirst;
    else if (!selTime) e.time = t.book.pickDayFirst;
    setErrors(e);
    if (Object.keys(e).length) return;

    // Combine selected day + slot into an ISO timestamp.
    const startTime = new Date(selDate!);
    const m = selTime.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (m) {
      let h = parseInt(m[1], 10) % 12;
      if (m[3] === "PM") h += 12;
      startTime.setHours(h, parseInt(m[2], 10), 0, 0);
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startTime: startTime.toISOString(), locale: lang }),
      });
      if (!res.ok) { setErrors({ _form: t.err.generic }); return; }
      Conversions.booking();
      onDone();
    } catch {
      setErrors({ _form: t.err.generic });
    } finally {
      setSubmitting(false);
    }
  };

  const summary = selDate
    ? `${t.book.months[selDate.getMonth()]} ${selDate.getDate()}${selTime ? ` · ${selTime}` : ""}`
    : "";

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.05fr_.95fr]">
      {/* Left — details + confirm */}
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
        </div>
        <div className="mt-[26px] flex flex-wrap items-center justify-between gap-4" style={{ paddingTop: 22, borderTop: "1px solid rgba(54,41,26,.08)" }}>
          {selDate && selTime ? (
            <div className="flex flex-col gap-[3px]">
              <span style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#a99a7f" }}>{t.book.summaryTitle}</span>
              <span style={{ fontSize: 14.5, color: "#1c3a5e", fontWeight: 600 }}>{summary}</span>
            </div>
          ) : (
            <span style={{ fontSize: 13, color: "#b7a886" }}>{t.book.pickDayFirst}</span>
          )}
          <button className="au-btn-gold" disabled={submitting} onClick={confirm}>{submitting ? "…" : t.book.confirm}</button>
        </div>
        {(errors.date || errors.time || errors._form) && (
          <div className="au-err" style={{ marginTop: 12 }}>{errors.date || errors.time || errors._form}</div>
        )}
      </div>

      {/* Right — calendar */}
      <div className="lg:sticky lg:top-[100px]" style={{ background: "#fffaf2", border: "1px solid rgba(54,41,26,.1)", padding: "clamp(24px,3vw,34px)" }}>
        <div style={{ fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#897c64", marginBottom: 16 }}>{t.book.stepDate}</div>
        <div className="mb-4 flex items-center justify-between">
          <CalBtn onClick={prev} disabled={atCurrentMonth}>‹</CalBtn>
          <div className="au-serif" style={{ fontSize: 21, fontWeight: 600, color: "#1c3a5e" }}>{monthLabel}</div>
          <CalBtn onClick={next}>›</CalBtn>
        </div>
        <div className="grid grid-cols-7 gap-[6px]" style={{ marginBottom: 6 }}>
          {t.book.weekdays.map((w) => (
            <div key={w} style={{ textAlign: "center", fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", color: "#a99a7f", padding: "4px 0" }}>{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-[6px]">
          {cells.map((c, i) => {
            if (!c) return <div key={`b${i}`} />;
            const disabled = isPast(c) || isWeekend(c);
            const selected = sameDay(c, selDate);
            return (
              <button
                key={c.toISOString()}
                disabled={disabled}
                onClick={() => { setSelDate(c); setSelTime(""); }}
                style={{
                  aspectRatio: "1", borderRadius: 2, fontSize: 14,
                  fontWeight: selected ? 700 : 400,
                  border: `1px solid ${selected ? "#1c3a5e" : "rgba(54,41,26,.16)"}`,
                  background: selected ? "#1c3a5e" : "#fffaf2",
                  color: selected ? "#fff8ec" : disabled ? "rgba(54,41,26,.25)" : "#36291a",
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                {c.getDate()}
              </button>
            );
          })}
        </div>

        <div style={{ height: 1, background: "rgba(54,41,26,.08)", margin: "24px 0" }} />
        <div style={{ fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#897c64", marginBottom: 6 }}>{t.book.stepTime}</div>
        <div style={{ fontSize: 12, color: "#b7a886", marginBottom: 14 }}>{t.book.tzNote}</div>
        {!selDate ? (
          <div style={{ background: "#f7ecda", border: "1px dashed rgba(177,129,47,.4)", borderRadius: 2, padding: 20, textAlign: "center", fontSize: 13.5, color: "#9a8e76" }}>{t.book.pickDayFirst}</div>
        ) : slotsForDay.length === 0 ? (
          <div style={{ background: "#f7ecda", border: "1px dashed rgba(177,129,47,.4)", borderRadius: 2, padding: 20, textAlign: "center", fontSize: 13.5, color: "#9a8e76" }}>{t.book.noSlots}</div>
        ) : (
          <div className="grid grid-cols-3 gap-[9px]">
            {slotsForDay.map((sl) => {
              const active = sl === selTime;
              return (
                <button
                  key={sl}
                  onClick={() => setSelTime(sl)}
                  style={{
                    padding: "12px 6px", borderRadius: 2, fontSize: 13, cursor: "pointer",
                    border: `1px solid ${active ? "#1c3a5e" : "rgba(54,41,26,.16)"}`,
                    background: active ? "#1c3a5e" : "#fffaf2",
                    color: active ? "#fff8ec" : "#36291a",
                  }}
                >
                  {sl}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CalBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 36, height: 36, border: "1px solid rgba(54,41,26,.16)", background: "#fffaf2",
        borderRadius: 2, cursor: disabled ? "not-allowed" : "pointer", fontSize: 16,
        color: disabled ? "rgba(54,41,26,.2)" : "#1c3a5e",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}
