# WeddConnect Platform

WeddConnect (<https://weddconnect.com>) is a wedding services marketplace for Rwanda. Couples browse
wedding vendors and services (venues, planners, photographers, etc.), and subscribe to a paid plan to
unlock vendor contacts. Payments are processed through **IremboPay**. An admin dashboard manages
vendors, listings, categories, clients, subscriptions, finance and the blog.

- **Client:** Creators Company Ltd
- **Developed by:** Desc Softlab Ltd — <info@descsoftlab.com>

---

## Tech stack

| Layer          | Technology                                                         |
| -------------- | ------------------------------------------------------------------ |
| Framework      | Next.js 16 (App Router, Server Components, Server Actions), React 19 |
| Language       | TypeScript                                                         |
| Database       | PostgreSQL via Prisma ORM 7 (`@prisma/adapter-pg`)                 |
| Auth           | NextAuth v4 — Google OAuth + email/password (JWT sessions, 2h)     |
| Payments       | IremboPay (`@irembo/irembopay-node-sdk` + browser widget)          |
| File storage   | S3-compatible object storage (`@aws-sdk/client-s3`)                |
| UI             | Tailwind CSS 3, Radix UI, Headless UI, MUI icons, Motion, Tiptap   |
| Data fetching  | TanStack Query (client), Server Actions (server)                   |
| Hosting        | Vercel (app) · Desc Managed PostgreSQL (database)                  |

> **Note:** This Next.js version has breaking changes compared to older versions. Before changing
> framework-level code, read the bundled docs in `node_modules/next/dist/docs/` (see `AGENTS.md`).

---

## Getting started

### Prerequisites

- Node.js 20+ (developed on Node 22)
- npm
- PostgreSQL 14+ (local instance or a remote database)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
#    then fill in the values (see "Environment variables" below)

# 3. Create the database schema
npx prisma migrate deploy      # applies all migrations in prisma/migrations
npx prisma generate            # generates the Prisma client

# 4. Run the dev server
npm run dev                    # http://localhost:3000
```

### Scripts

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Start the dev server (Turbopack)                 |
| `npm run build`    | `prisma generate` + production build             |
| `npm run start`    | Serve the production build on port 3000          |
| `npm run lint`     | Run ESLint                                       |
| `ANALYZE=true npm run build` | Build with the bundle analyzer         |

---

## Environment variables

All variables are listed (without values) in [`.env.example`](.env.example). Production values are
configured in the Vercel project settings and are **never** committed to the repository.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET` | NextAuth base URL and signing secret |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth sign-in |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Object storage credentials (server only) |
| `AWS_S3_BUCKET_NAME`, `AWS_S3_REGION`, `NEXT_PUBLIC_AWS_S3_REGION` | Bucket name and region |
| `NEXT_PUBLIC_BASE_URL` | Public base URL of the site |
| `SERVER_API_URL`, `NEXT_PUBLIC_SERVER_API_URL` | Base URL of the internal `/api` routes |
| `IPAY_SECRET_KEY` | IremboPay secret key (server only; also used to verify webhooks) |
| `IPAY_ENVIRONMENT`, `NEXT_PUBLIC_IPAY_ENVIRONMENT` | `sandbox` or `production` |
| `IPAY_PAYMENT_ACCOUNT_IDENTIFIER` | IremboPay payment account |
| `NEXT_PUBLIC_IPAY_PUBLIC_KEY`, `NEXT_PUBLIC_IPAY_WIDGET_SRC` | IremboPay browser widget |

> Never put a secret in a variable prefixed with `NEXT_PUBLIC_` — those are exposed to the browser.

---

## Project structure

```
prisma/
  schema/            Prisma schema split by domain (auth, admin, crm, post, vendor, service, blog)
  migrations/        SQL migrations (apply with `prisma migrate deploy`)
src/
  app/               Routes (App Router)
    (sacred)/posts/  Public listings: venues, wedding planning, post details
    services/        Services catalogue
    blog/            Public blog
    auth/            Login, sign-up, reset password
    profile/         Client account, settings, subscription & payment history
    subscribe/, pay/ Subscription checkout (IremboPay)
    dashboard/admin/ Admin dashboard (posts, vendors, categories, clients, finance, blog, users)
    api/             Route handlers (read endpoints, NextAuth, IremboPay webhook)
  server-actions/    Server Actions — all database reads/writes, grouped by entity
  components/        Shared UI components (forms, cards, layouts, views)
  common/            Auth options, shared types, enums, zod schemas
  config/            AWS S3 and IremboPay clients
  lib/               Prisma client, React Query client, helpers
    auth-guard.ts    Authorization helpers used by every server action (see "Security")
    server/          Server-only internals (account creation, payment reconciliation)
  util/              Helpers (S3 upload, dates, images, IremboPay widget, WhatsApp links)
  services/          Fetch wrapper and API endpoint constants
docs/irembo-pay/     IremboPay integration documentation (config, schema, flow, testing)
```

---

## Key flows

**Authentication.** NextAuth (`src/common/authOptions.ts`) supports Google and email/password.
The user's type (`client`, `vendor`, `admin`) comes from the related `Client` / `Vendor` / `Admin`
record. The admin dashboard is protected in `src/app/dashboard/admin/layout.tsx`.

**Subscriptions & payments (IremboPay).**
1. A signed-in client picks a plan → `createSubscriptionInvoice()` creates an IremboPay invoice and a
   `PENDING` transaction.
2. The IremboPay widget opens in the browser for payment (methods as enabled on the merchant account).
3. IremboPay calls the webhook `POST /api/irembo-pay/callback` (HMAC-signed) → `reconcileInvoicePayment()`
   marks the transaction `PAID` and extends the subscription expiry.
4. As a fallback, the client polls `checkInvoiceStatus()`, which re-verifies directly with IremboPay.

Each subscription plan needs an **IremboPay Product Code**, set in Admin → Subscriptions.
See [`docs/irembo-pay/`](docs/irembo-pay/) for full details.

**Access to listings.** Vendor listings (`/posts`) and their contacts are paid content: only admins
and clients with a non-expired subscription can read them (enforced in the posts layout *and* in the
post server actions / API routes).

**Media uploads.** Images are uploaded server-side to the S3 bucket (`src/util/s3Helpers.ts`).
The allowed image hosts are configured in `next.config.ts`.

---

## Security

Every exported function in a `"use server"` file is a **public HTTP endpoint** — anyone can call it
with any arguments, even if no button in the UI calls it. Hiding a page or a button does not protect
an action. Rules for this codebase:

1. **Every server action checks its caller** with the helpers in `src/lib/auth-guard.ts`:
   - `requireAdmin()` — admin-only actions (all create/update/delete of catalogue, vendors, finance…)
   - `requireUser()` / `requireClientAccess(id)` — signed-in users / the owner of a client record
   - `requireSubscriberOrAdmin()` — vendor listings (paid content)
   - `scopePublicQuery()` — public reads: strips sensitive fields (passwords, phones, payments…)
     from caller-supplied `select`/`where`/`orderBy`, caps page size and masks e-mail addresses
2. Inside `try/catch` blocks in server code, call `unstable_rethrow(error)` first so Next.js
   internal errors (redirects, dynamic rendering) are not swallowed.
3. Code that must run without an admin session (sign-up, first Google login, the IremboPay
   webhook) lives in `src/lib/server/` (marked `server-only`) — never in a `"use server"` file.
4. Never return the `password` field; never put secrets in `NEXT_PUBLIC_` variables.
5. API routes that expose personal data (`/api/user`, `/api/client`, `/api/vendor`, `/api/role`,
   `/api/permission`) require an admin session.

---

## Database

- Schema files: `prisma/schema/*.prisma` (configured in `prisma.config.ts`).
- Create a migration after a schema change: `npx prisma migrate dev --name <description>`
- Apply migrations to production: `DATABASE_URL=<prod> npx prisma migrate deploy`
  (migrations are **not** applied automatically by the Vercel build).

---

## Deployment

- Hosted on **Vercel**. Pushing to the `main` branch triggers a production deployment.
- Environment variables are managed in the Vercel project settings.
- Run any pending database migrations against production before (or right after) deploying a
  release that includes schema changes.
- The IremboPay webhook URL configured in the IremboPay merchant portal must point to
  `https://weddconnect.com/api/irembo-pay/callback`.

---

© Creators Company Ltd. Developed by Desc Softlab Ltd.
