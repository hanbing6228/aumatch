# Deployment guide — AuMatch Concierge

This app is a unified Next.js full-stack deployed to **Vercel** (frontend + API +
serverless functions) with a **PostgreSQL** database. Below is the exact, ordered
checklist. Items that require *your* accounts/secrets are marked **(you)**.

---

## 1. Database (PostgreSQL)

Pick one. Vercel Postgres is simplest since it co-locates with the app.

### Option A — Vercel Postgres / Neon (recommended)
1. **(you)** In the Vercel dashboard → Storage → Create Database → Postgres.
2. Vercel injects `POSTGRES_*` vars. Add these two app vars (Settings → Env):
   - `DATABASE_URL` = the **pooled** connection string (`...-pooler...`)
   - `DIRECT_URL`   = the **non-pooling** connection string
3. Create the schema (first-time provisioning — no migration files needed):
   ```bash
   DATABASE_URL=... DIRECT_URL=... npx prisma db push
   ```

### Option B — Heroku Postgres
1. **(you)** `heroku addons:create heroku-postgresql:essential-0 -a <app>`
2. `heroku config:get DATABASE_URL -a <app>` → use for both `DATABASE_URL` and
   `DIRECT_URL` (append `?sslmode=require`).
3. `DATABASE_URL=... npx prisma db push`

> For first provisioning use `prisma db push` (applies the schema directly — no
> migration files required). Once you want versioned migrations, run
> `npx prisma migrate dev --name init` locally with a reachable DB (commits
> `prisma/migrations/`), then `prisma migrate deploy` in CI/prod.

## 2. Google OAuth **(you)**

1. https://console.cloud.google.com → APIs & Services → Credentials.
2. Create OAuth client (Web application).
3. Authorized redirect URI:
   `https://<your-domain>/api/auth/callback/google`
   (and `http://localhost:3000/api/auth/callback/google` for local).
4. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

## 3. Calendly **(you)**

1. Create your event type (e.g. a 30-min "Intro consultation").
2. Set `NEXT_PUBLIC_CALENDLY_URL` = `https://calendly.com/<you>/intro-call`.
   The `/book` page embeds it automatically; without it, the in-app booking form
   is shown as a fallback.
3. **Webhook** (so bookings land in your DB + admin):
   - Create a webhook subscription via the Calendly API for `invitee.created`
     and `invitee.canceled`, with the URL
     `https://<your-domain>/api/calendly/webhook`.
   - Store the subscription's signing key as `CALENDLY_WEBHOOK_SIGNING_KEY`.

## 4. Auth secret

```bash
openssl rand -base64 32   # → AUTH_SECRET
```
Also set `AUTH_URL=https://<your-domain>` and `AUTH_TRUST_HOST=true`.

## 5. GitHub

The repo pushes to `git@github.com:hanbing6228/aumatch.git`. Already initialized
and committed in this project.

## 6. Vercel

1. **(you)** Import `hanbing6228/aumatch` in Vercel (or link the existing
   `aumatch` project): `vercel link` / dashboard → Add New → Project.
2. Framework preset: **Next.js** (auto-detected). Build command stays the default
   (`npm run build`, which runs `prisma generate && next build`).
3. Add **all** env vars from `.env.example` (Production + Preview).
4. Deploy. Vercel runs the build, generates the Prisma client, and serves.
5. After first deploy, run `prisma migrate deploy` against the prod DB (step 1).
6. Sign in once with an `ADMIN_EMAILS` address → you're auto-promoted to ADMIN →
   visit `/admin`.

## 7. Post-deploy smoke test

- `/` loads, EN/中文 toggle switches all copy.
- `/find` submit → 201 → row appears in `/admin` → Family Leads.
- `/join` submit (consent required) → row in Provider Applications.
- `/book` shows Calendly (or fallback) → booking recorded.
- `/portal` → Google sign-in and email/password both work.
- `GET /api/health` → `{ status: "ok", db: "up" }`.

## Custom domain **(you)**

Vercel → Settings → Domains → add `aumatch.com`. Update `AUTH_URL` and the Google
redirect URI to the final domain.
