"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useI18n } from "@/lib/i18n";
import { isValidEmail } from "@/lib/format";

export default function PortalPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div style={{ minHeight: 400 }} />;
  }
  if (status === "authenticated" && session?.user) {
    return <Dashboard />;
  }
  return <AuthCard />;
}

// ───────── Sign in / register ─────────
function AuthCard() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", portalRole: "family" });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const e: Record<string, string> = {};
    if (mode === "register" && form.name.trim().length < 2) e.name = t.err.name;
    if (!isValidEmail(form.email)) e.email = t.err.email;
    if (form.password.length < 8) e.password = t.err.required;
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: form.name, email: form.email, password: form.password, portalRole: form.portalRole }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setErrors({ _form: d.error || t.err.generic });
          return;
        }
      }
      const r = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (r?.error) { setErrors({ _form: t.err.generic }); return; }
      window.location.href = "/portal";
    } catch {
      setErrors({ _form: t.err.generic });
    } finally {
      setBusy(false);
    }
  };

  const isReg = mode === "register";

  return (
    <section style={{ background: "radial-gradient(130% 100% at 50% -16%, #fff8ee 0%, #ecd9b2 72%)", padding: "clamp(60px,8vw,104px) 28px clamp(70px,9vw,116px)" }}>
      <div className="mx-auto grid max-w-[1000px] grid-cols-1 md:grid-cols-[.9fr_1.1fr]" style={{ border: "1px solid rgba(54,41,26,.12)", boxShadow: "0 30px 70px rgba(28,58,94,.12)" }}>
        {/* Left brand panel */}
        <div style={{ background: "radial-gradient(120% 130% at 30% 0%, #21405f 0%, #14283f 70%)", color: "#ecdcc0", padding: "clamp(38px,4.5vw,52px)", position: "relative", overflow: "hidden" }}>
          <Image src="/assets/logo.png" alt="" width={200} height={200} aria-hidden style={{ position: "absolute", right: "-12%", bottom: "-8%", height: 200, width: "auto", opacity: 0.07 }} />
          <div className="relative mb-[30px] flex items-center gap-[11px]">
            <Image src="/assets/logo.png" alt="" width={38} height={38} style={{ height: 38, width: "auto" }} />
            <span className="au-serif" style={{ fontSize: 24, fontWeight: 600 }}>
              <span style={{ color: "#d8b878" }}>{t.brand.a}</span><span style={{ color: "#fff8ec" }}>{t.brand.b}</span>
            </span>
          </div>
          <div className="au-serif relative" style={{ fontSize: "clamp(26px,3vw,33px)", lineHeight: 1.16, color: "#fff8ec", margin: "0 0 14px" }}>{t.portal.title}</div>
          <p className="relative" style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(236,220,192,.66)", margin: "0 0 26px", maxWidth: 300 }}>{t.portal.sub}</p>
          <div className="relative flex flex-col gap-[14px]">
            {t.trust.items.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 13.5, color: "rgba(236,220,192,.78)" }}>
                <span style={{ color: "#d8b878", fontSize: 9 }}>◆</span>{b.title}
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div style={{ background: "#fffaf2", padding: "clamp(34px,4vw,52px)" }}>
          <div className="mb-[30px] flex gap-[26px]" style={{ borderBottom: "1px solid rgba(54,41,26,.12)" }}>
            <Tab active={!isReg} onClick={() => setMode("login")}>{t.portal.tabLogin}</Tab>
            <Tab active={isReg} onClick={() => setMode("register")}>{t.portal.tabRegister}</Tab>
          </div>

          <button onClick={() => signIn("google", { callbackUrl: "/portal" })} className="au-btn-outline" style={{ width: "100%", marginBottom: 18 }}>
            <GoogleIcon /> {t.portal.googleBtn}
          </button>
          <div className="mb-4 flex items-center gap-3" style={{ color: "#b7a886", fontSize: 12 }}>
            <span style={{ flex: 1, height: 1, background: "rgba(54,41,26,.12)" }} />{t.portal.or}<span style={{ flex: 1, height: 1, background: "rgba(54,41,26,.12)" }} />
          </div>

          <div className="flex flex-col gap-[18px]">
            {isReg && (
              <>
                <div>
                  <label className="au-label">{t.portal.nameL} <span style={{ color: "#b1812f" }}>*</span></label>
                  <input className="au-input" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  {errors.name && <div className="au-err">{errors.name}</div>}
                </div>
                <div>
                  <label className="au-label">{t.portal.roleL}</label>
                  <select className="au-input" value={form.portalRole} onChange={(e) => set("portalRole", e.target.value)} style={{ appearance: "none", cursor: "pointer" }}>
                    {t.portal.roleOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="au-label">{t.portal.emailL} <span style={{ color: "#b1812f" }}>*</span></label>
              <input className="au-input" inputMode="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              {errors.email && <div className="au-err">{errors.email}</div>}
            </div>
            <div>
              <label className="au-label">{t.portal.passL} <span style={{ color: "#b1812f" }}>*</span></label>
              <input className="au-input" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} />
              {errors.password && <div className="au-err">{errors.password}</div>}
            </div>
            {!isReg && (
              <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                <label className="flex items-center gap-2" style={{ cursor: "pointer", color: "#6f6450" }}>
                  <input type="checkbox" style={{ width: 15, height: 15, accentColor: "#b1812f" }} />{t.portal.remember}
                </label>
              </div>
            )}
            {errors._form && <div className="au-err">{errors._form}</div>}
            <button className="au-btn-gold" disabled={busy} onClick={submit}>
              {busy ? "…" : isReg ? t.portal.registerBtn : t.portal.loginBtn}
            </button>
            <div className="text-center" style={{ fontSize: 13.5, color: "#6f6450" }}>
              {isReg ? t.portal.switchToLogin : t.portal.switchToReg}{" "}
              <span onClick={() => setMode(isReg ? "login" : "register")} style={{ color: "#b1812f", cursor: "pointer", fontWeight: 600 }}>
                {isReg ? t.portal.switchToLoginCta : t.portal.switchToRegCta}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────── Member dashboard ─────────
function Dashboard() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      <section style={{ background: "#14283f", color: "#ecdcc0", padding: "clamp(30px,4vw,44px) 28px" }}>
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4">
          <div>
            <div style={{ fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#d8b878", marginBottom: 8 }}>{t.portal.greeting}</div>
            <div className="au-serif" style={{ fontSize: "clamp(26px,3.2vw,38px)", color: "#fff8ec", lineHeight: 1 }}>{user?.name || user?.email}</div>
            <div style={{ fontSize: 12.5, color: "rgba(236,220,192,.55)", marginTop: 7 }}>{t.portal.memberSince}</div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} style={{ background: "transparent", color: "#ecdcc0", border: "1px solid rgba(209,176,105,.4)", padding: "11px 22px", fontSize: 13, letterSpacing: ".04em", cursor: "pointer", borderRadius: 2 }}>
            {t.portal.signout}
          </button>
        </div>
      </section>

      <section style={{ padding: "clamp(28px,3.5vw,44px) 28px clamp(64px,8vw,104px)" }}>
        <div className="mx-auto flex max-w-content flex-col gap-6">
          {/* Account card */}
          <div style={{ background: "#fffaf2", border: "1px solid rgba(54,41,26,.09)", padding: "clamp(26px,3vw,36px)" }}>
            <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 24, color: "#1c3a5e", margin: "0 0 24px" }}>{user?.name || t.portal.navItems[2].label}</h3>
            <div style={{ border: "1px solid rgba(54,41,26,.1)" }}>
              <Row label={t.portal.emailL} value={user?.email || "—"} />
              <Row label={t.portal.memberSince} value="AuMatch Concierge" />
              {user?.role && user.role !== "MEMBER" && <Row label="Role" value={user.role} />}
            </div>
            {(user?.role === "ADMIN" || user?.role === "CONCIERGE") && (
              <Link href="/admin" className="au-btn-navy" style={{ marginTop: 20 }}>Open admin dashboard →</Link>
            )}
          </div>

          {/* CTA */}
          <div style={{ background: "#d1b069", padding: "clamp(28px,3vw,38px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
            <div>
              <h3 className="au-serif" style={{ fontWeight: 600, fontSize: 24, color: "#14283f", margin: "0 0 6px" }}>{t.portal.actCardTitle}</h3>
              <p style={{ fontSize: 14, color: "rgba(20,40,63,.7)", margin: 0 }}>{t.portal.actCardSub}</p>
            </div>
            <Link href="/find" className="au-btn-navy">{t.portal.actCardBtn}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, letterSpacing: ".02em", padding: "0 0 14px", color: active ? "#1c3a5e" : "#897c64", borderBottom: `2px solid ${active ? "#b1812f" : "transparent"}`, marginBottom: -1 }}>
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid rgba(54,41,26,.08)" }}>
      <span style={{ fontSize: 13, color: "#8a8275" }}>{label}</span>
      <span style={{ fontSize: 14, color: "#36291a" }}>{value}</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
