"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useI18n } from "@/lib/i18n";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const { status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/find", label: t.nav.find },
    { href: "/join", label: t.nav.join },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "rgba(247,236,218,.9)",
        backdropFilter: "saturate(140%) blur(12px)",
        WebkitBackdropFilter: "saturate(140%) blur(12px)",
        borderBottom: "1px solid rgba(177,129,47,.28)",
      }}
    >
      <div className="mx-auto flex h-[78px] max-w-content items-center justify-between gap-6 px-7">
        <Link href="/" className="flex items-center gap-3" aria-label="AuMatch home">
          <Image src="/assets/logo.png" alt="AuMatch" width={42} height={42} style={{ height: 42, width: "auto" }} priority />
          <span style={{ width: 1, height: 30, background: "linear-gradient(#c79a45,rgba(28,58,94,.35))" }} />
          <span className="flex flex-col items-start leading-none">
            <span className="au-serif" style={{ fontSize: 25, fontWeight: 600, letterSpacing: ".04em" }}>
              <span style={{ color: "#b1812f" }}>{t.brand.a}</span>
              <span style={{ color: "#1c3a5e" }}>{t.brand.b}</span>
            </span>
            <span style={{ fontSize: 8, letterSpacing: ".34em", color: "#9a7b3e", textTransform: "uppercase", marginTop: 4 }}>
              {t.brand.sub}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-[26px] md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontSize: 13.5,
                letterSpacing: ".02em",
                color: isActive(item.href) ? "#b1812f" : "#36291a",
                transition: "color .2s",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/portal" className="flex items-center gap-2" style={{ fontSize: 13, color: "#36291a" }}>
            <span style={{ display: "inline-flex", width: 22, height: 22, border: "1px solid currentColor", borderRadius: "50%", alignItems: "center", justifyContent: "center", fontSize: 11 }}>◔</span>
            {status === "authenticated" ? t.portal.greeting : t.nav.signin}
          </Link>
          <span style={{ width: 1, height: 18, background: "rgba(54,41,26,.18)" }} />
          <LangToggle lang={lang} setLang={setLang} />
          <Link href="/book" className="au-btn-gold" style={{ padding: "11px 22px", fontSize: 13 }}>
            {t.nav.cta}
          </Link>
        </div>

        {/* Mobile cluster: language toggle + Book CTA + menu, all visible */}
        <div className="flex items-center gap-2.5 md:hidden">
          <LangToggle lang={lang} setLang={setLang} />
          <Link
            href="/book"
            aria-label={t.nav.cta}
            className="au-btn-gold"
            style={{ padding: "9px 12px", fontSize: 12, gap: 6 }}
          >
            <CalendarIcon />
            <span>{lang === "zh" ? "预约" : "Book"}</span>
          </Link>
          <button
            className="flex flex-col items-center justify-center gap-1"
            style={{ width: 40, height: 38, border: "1px solid rgba(177,129,47,.4)", borderRadius: 2, background: "none", flexShrink: 0 }}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span style={{ width: 18, height: 1.5, background: "#1c3a5e" }} />
            <span style={{ width: 18, height: 1.5, background: "#1c3a5e" }} />
            <span style={{ width: 18, height: 1.5, background: "#1c3a5e" }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden" style={{ background: "#fffaf2", borderTop: "1px solid rgba(177,129,47,.2)", padding: "14px 28px 26px" }}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block"
              style={{ borderBottom: "1px solid rgba(54,41,26,.08)", fontSize: 16, padding: "15px 0", color: isActive(item.href) ? "#b1812f" : "#36291a" }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/portal" onClick={() => setOpen(false)} className="block" style={{ fontSize: 16, padding: "15px 0", color: "#36291a" }}>
            {t.nav.signin}
          </Link>
        </div>
      )}
    </header>
  );
}

function LangToggle({
  lang,
  setLang,
}: {
  lang: "en" | "zh";
  setLang: (l: "en" | "zh") => void;
}) {
  return (
    <div className="flex items-center gap-[9px]" style={{ fontSize: 13, letterSpacing: ".04em" }}>
      <button onClick={() => setLang("en")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: lang === "en" ? "#b1812f" : "rgba(54,41,26,.55)", fontWeight: lang === "en" ? 600 : 400 }}>
        EN
      </button>
      <span style={{ color: "rgba(54,41,26,.25)" }}>|</span>
      <button onClick={() => setLang("zh")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: lang === "zh" ? "#b1812f" : "rgba(54,41,26,.55)", fontWeight: lang === "zh" ? 600 : 400 }}>
        中文
      </button>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18M8 2v4M16 2v4" />
    </svg>
  );
}
