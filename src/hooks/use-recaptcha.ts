"use client";

import { useCallback } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (!SITE_KEY) return Promise.resolve();
  if (typeof window === "undefined") return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve) => {
    const id = "recaptcha-v3";
    if (document.getElementById(id)) return resolve();
    const s = document.createElement("script");
    s.id = id;
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.async = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
  return scriptPromise;
}

// Returns a token for the given action, or null when reCAPTCHA isn't configured.
export function useRecaptcha() {
  return useCallback(async (action: string): Promise<string | null> => {
    if (!SITE_KEY) return null;
    await loadScript();
    return new Promise((resolve) => {
      window.grecaptcha?.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(SITE_KEY, { action });
          resolve(token);
        } catch {
          resolve(null);
        }
      });
    });
  }, []);
}
