# AuMatch Concierge

Boutique, fully-vetted **home care & private household staffing** platform for the
Research Triangle (Cary · Raleigh · Durham · Chapel Hill · Apex · Morrisville).
Bilingual **EN / 中文**, navy + brushed-gold "Gold Standard" brand.

> The element **Au** is gold — we *pan for gold*: rigorous vetting that surfaces the
> rare few who truly fit a household.

## Tech stack

| Layer       | Choice                                                    |
| ----------- | --------------------------------------------------------- |
| Framework   | Next.js 15 (App Router) + React 19 + TypeScript           |
| Styling     | Tailwind CSS + design tokens (navy/gold/cream)            |
| Auth        | Auth.js (NextAuth v5) — Google OAuth + email/password     |
| Database    | PostgreSQL via Prisma ORM                                 |
| Scheduling  | Calendly (inline embed + signed webhook)                  |
| Hosting     | Vercel (frontend + API routes + serverless)               |
| i18n        | Custom EN/中文 dictionary + context, persisted preference |

## Architecture

```
src/
  app/
    (site)/            Public bilingual marketing + lead-gen (shared header/footer)
      page.tsx           Home — hero, advantages, services, testimonials
      about/             Brand story, process, mission/vision, values
      services/          Service lines, "every placement includes", FAQ
      find/              P0 Employer intake form  → POST /api/leads/employer
      join/              P0 Provider application   → POST /api/leads/provider
      book/              Consultation — Calendly embed or in-app fallback
      portal/            Member portal: Google + email/password, dashboard
    admin/             Staff dashboard (ADMIN | CONCIERGE) — manage all leads
    api/
      auth/[...nextauth]   NextAuth handlers
      register             Email/password sign-up
      leads/employer       Family intake (persists + notifies team)
      leads/provider       Provider application
      bookings             In-app consult booking fallback
      calendly/webhook     Calendly invitee.created / .canceled → ConsultBooking
      admin/leads          List + PATCH status (role-guarded)
      health               Liveness + DB probe
  auth.config.ts       Edge-safe auth config (used by middleware)
  auth.ts              Full Node auth (Prisma adapter + Credentials)
  middleware.ts        Route protection for /admin/*
  lib/                 db, validation (zod), password, authz, notify, format, i18n
prisma/schema.prisma   User/Account/Session + EmployerLead/ProviderApplication/ConsultBooking
```

**Security:** zod validation on every endpoint, bcrypt password hashing, role-based
authz, signed Calendly webhooks, security headers (`next.config.mjs`), secrets never
committed. Forms validate client- and server-side with localized messages.

## Local development

```bash
cp .env.example .env          # fill in the values
npm install
npm run db:push               # create tables (needs a reachable Postgres)
npm run dev                   # http://localhost:3000
```

To grant yourself admin: set `ADMIN_EMAILS`, sign in once, then `npm run db:seed`
(or just sign in — bootstrap admins are auto-promoted on login).

## Environment variables

See [`.env.example`](.env.example). Required in production:

- `DATABASE_URL` / `DIRECT_URL` — Postgres (pooled / direct for migrations)
- `AUTH_SECRET` — `openssl rand -base64 32`
- `AUTH_URL` — canonical site URL
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth
- `NEXT_PUBLIC_CALENDLY_URL` — your Calendly event link
- `CALENDLY_WEBHOOK_SIGNING_KEY` — verifies webhook payloads
- `ADMIN_EMAILS` — comma-separated emails auto-promoted to ADMIN
- *(optional)* `RESEND_API_KEY` + `RESEND_FROM` — real email alerts to info@aumatch.com

## Deployment — see [DEPLOYMENT.md](DEPLOYMENT.md)

Quick version:

1. **Database** — provision Postgres (Vercel Postgres / Neon / Heroku Postgres),
   set `DATABASE_URL` + `DIRECT_URL`, then `npx prisma migrate deploy`.
2. **Google OAuth** — create credentials; redirect URI
   `https://<domain>/api/auth/callback/google`.
3. **Calendly** — set `NEXT_PUBLIC_CALENDLY_URL`; subscribe a webhook to
   `https://<domain>/api/calendly/webhook` and store its signing key.
4. **Vercel** — import the repo, add env vars, deploy. `build` runs
   `prisma generate && next build`.

## Notes / next steps

- **Provider file upload** currently records the file name; wire `@vercel/blob`
  (or S3) in `join/page.tsx` + `api/leads/provider` to store the binary and pass
  `documentUrl`.
- **reCAPTCHA / GA4** (per PRD): add `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` gating on the
  two P0 forms, and a GA4 tag with conversion events on the submit buttons.
- **Background checks**: the Checkr API integration is a documented next step from
  the provider application record.
