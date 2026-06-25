import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Hanken_Grotesk,
  Noto_Serif_SC,
  Noto_Sans_SC,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Analytics } from "@/components/analytics";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Chinese faces for the bilingual UI.
const serifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif-sc",
  display: "swap",
});

const sansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans-sc",
  display: "swap",
});

const siteUrl = process.env.AUTH_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "AuMatch Concierge — Premium Home Care & Household Staffing · Cary · Raleigh",
    template: "%s · AuMatch Concierge",
  },
  description:
    "AuMatch Concierge is a boutique, fully-vetted home care and private household staffing agency for the Research Triangle (Cary, Raleigh, Durham, Chapel Hill). Checkr-verified, bonded & insured. 北卡高端月嫂、育儿嫂、私人管家中介。",
  keywords: [
    "Premium Home Care Cary Raleigh",
    "北卡高端月嫂",
    "Cary 华人保姆中介",
    "AuMatch Concierge",
    "household staffing Research Triangle",
    "newborn care Cary",
    "estate manager Raleigh",
  ],
  openGraph: {
    title: "AuMatch Concierge — The Gold Standard in Home Care",
    description:
      "Discreet, fully-vetted home care and private household staffing for the Triangle's most discerning families.",
    type: "website",
    locale: "en_US",
    alternateLocale: "zh_CN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${serifSC.variable} ${sansSC.variable}`}
    >
      <body>
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
