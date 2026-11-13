# WeddConnect Technical Handover Document

| | |
|---|---|
| **Project** | WeddConnect Platform |
| **Production URL** | <https://weddconnect.com> |
| **Client** | Creators Company Ltd |
| **Client contact** | Enock Niyonzima |
| **Developed by** | Desc Softlab Ltd — <info@descsoftlab.com> |
| **Project Manager** | Dushime Brother (Desc Softlab Ltd) |
| **Document version** | 1.0 |
| **Handover date** | ____________________ |
| **Classification** | Confidential — Client and appointed development team only |

---

## 1. Purpose of this document

This document hands over the WeddConnect platform from Desc Softlab Ltd to Creators Company Ltd. It gives any development team that takes over the platform what they need to understand the system, run it locally, deploy it and maintain it safely.

It is meant to be read **together with the source code**. More detail lives in the repository:

- `README.md` covers setup, scripts, project structure and security rules.
- `docs/irembo-pay/` covers the IremboPay payment integration in depth (configuration, schema, server flow, client flow, admin, testing).
- `.env.example` lists every environment variable the application needs, without values.

**Credentials are not included in this document.** They are delivered separately through a secure channel.

---

## 2. System overview

WeddConnect is a wedding services marketplace for Rwanda. Couples (clients) browse wedding vendors and their services: venues, wedding planning, décor, photography and more. They buy a subscription plan to get access to vendor listings and vendor contact details. Payments go through **IremboPay**.

### 2.1 User roles

| Role | How they get access | What they can do |
|---|---|---|
| **Visitor** | No account | View the home page, services, blog, FAQs, help centre and legal pages; sign up |
| **Client** | Sign-up with email/password or Google | Manage their profile; buy or renew a subscription; with an active subscription, browse vendor listings and contact vendors; leave reviews and blog comments |
| **Admin** | Admin record linked to a user account | Full back-office: vendors, listings, categories and features, clients and subscriptions, finance and transactions, blog, admin users, roles and permissions |

Vendors are managed by admins. There is no self-service vendor portal at this time.

### 2.2 Main functional areas

| Area | Routes | Description |
|---|---|---|
| Public site | `/`, `/services`, `/about`, `/faqs`, `/help-center`, `/legal/*` | Marketing and information pages |
| Blog | `/blog`, `/blog/[slug]` | Published articles with comments |
| Authentication | `/auth/login`, `/auth/sign-up`, `/auth/reset-password` | Email/password and Google sign-in |
| Listings (paid) | `/posts`, `/posts/[id]`, `/posts/venues`, `/posts/wedding-planning` | Vendor listings with images, prices, packages, features, reviews and contacts. Requires an active subscription |
| Subscription & payment | `/subscribe`, `/pay`, `/profile/subscription` | Plan selection and IremboPay checkout |
| Client account | `/profile`, `/profile/settings` | Profile, subscription status and payment history (with "Pay Now" retry for pending payments) |
| Admin dashboard | `/dashboard/admin/*` | Statistics, posts, vendors, services, categories, clients (active, pending, expired, none), subscriptions, finance, blog, users |

---

## 3. Technology stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components, Server Actions), React 19 |
| Language | TypeScript 5 |
| Database | PostgreSQL, accessed through Prisma ORM 7 (`@prisma/adapter-pg` driver adapter) |
| Authentication | NextAuth v4: Google OAuth and email/password, JWT sessions (2-hour lifetime) |
| Payments | IremboPay: `@irembo/irembopay-node-sdk` on the server, IremboPay widget in the browser |
| File storage | S3-compatible object storage (`@aws-sdk/client-s3`) |
| UI | Tailwind CSS 3, Radix UI, Headless UI, Lucide and MUI icons, Motion, Tiptap (rich text editor) |
| Client data fetching | TanStack Query |
| Validation | Zod |
| Hosting | Vercel (application), Desc Managed PostgreSQL (database), Desc Hosting (object storage) |

> **Note for developers:** Next.js 16 has breaking changes compared to earlier versions. Before changing framework-level code, read the documentation bundled with the installed version in `node_modules/next/dist/docs/` (see `AGENTS.md` in the repository).

---

## 4. Architecture

### 4.1 High-level view

```
   Browser (client / admin)
        │  HTTPS
        ▼
┌──────────────────────── Vercel ────────────────────────┐
│  Next.js 16 application                                 │
│   • Server Components (pages, layouts)                  │
│   • Server Actions  (src/server-actions/*)  ── all DB   │
│   • Route Handlers  (src/app/api/*)            access   │
│   • NextAuth        (/api/auth/*)                       │
└───────┬───────────────────┬───────────────────┬────────┘
        │ Prisma (TCP/SSL)  │ S3 API            │ HTTPS
        ▼                   ▼                   ▼
 Desc Managed          Desc Hosting         IremboPay
 PostgreSQL            Object Storage       (invoices, widget,
                       (images)              webhook → /api/irembo-pay/callback)

 Google OAuth ◄── sign-in with Google
```

### 4.2 How the code is organised

- **Pages and layouts** (`src/app`) are mostly Server Components. They load data on the server and pass it to interactive Client Components.
- **Server Actions** (`src/server-actions`) handle all database reads and writes, with one file per entity (for example `post.actions.ts`, `client.actions.ts`, `blog/blog-post.ts`). Client Components call them directly. Every action checks the caller's permissions (see Section 7).
- **Route Handlers** (`src/app/api`) are a small set of read endpoints, plus the NextAuth handler and the IremboPay webhook.
- **Server-only internals** (`src/lib/server`) contain operations that must never be callable from the browser: account creation at sign-up and payment reconciliation.
- **Select types** (`src/select-types`, `src/common/Entities.ts`) are reusable Prisma `select` shapes that define exactly which fields each screen loads.

### 4.3 Repository layout

```
prisma/schema/        Prisma schema split by domain
prisma/migrations/    21 SQL migrations (history since March 2025)
src/app/              Routes (public, auth, profile, subscribe/pay, admin, api)
src/server-actions/   Server Actions, grouped by entity
src/lib/              Prisma client, auth guards, server-only internals, static content
src/components/       UI components (forms, cards, containers, layouts, views)
src/common/           Auth configuration, shared types, enums, Zod schemas
src/config/           S3 and IremboPay clients
src/util/             Helpers (uploads, dates, images, IremboPay widget, WhatsApp links)
src/select-types/     Prisma select definitions per entity
docs/                 IremboPay documentation, this document, admin dashboard notes
```

---

## 5. Data model

The PostgreSQL schema is managed with Prisma. The schema is split into one file per domain in `prisma/schema/`.

| Schema file | Models | Purpose |
|---|---|---|
| `auth.prisma` | `User` | Login identity (email, hashed password, status, type) |
| `admin.prisma` | `Admin`, `Role`, `Permission`, `Account`, `VerificationToken` | Admin users and role/permission structure; OAuth accounts and tokens |
| `crm.prisma` | `Client`, `Subscription`, `ClientSubscription`, `Transaction` | Clients, subscription plans, each client's subscription (with `expiryAt`), payments |
| `vendor.prisma` | `Vendor`, `ContactType`, `VendorContact` | Vendors and their contact channels (phone, WhatsApp, email, etc.) |
| `post.prisma` | `Category`, `CategoryFeature`, `Post`, `PostFeature`, `PostImage`, `PostPrice`, `PostPackage`, `PostReview`, `PostLike` | Vendor listings with categorised features, images, price range, packages, reviews and likes |
| `service.prisma` | `Service` | Services catalogue |
| `blog.prisma` | `BlogCategory`, `BlogTag`, `BlogPost`, `BlogComment`, `BlogView` | Blog content (Draft / Published / Archived), comments and views |

**Key relationships**

- A `User` is linked to at most one `Client`, one `Vendor` or one `Admin`. That link determines the user's role.
- A `Client` has at most one `ClientSubscription`, which points to a `Subscription` plan. Access to listings depends on `ClientSubscription.expiryAt`.
- A `Transaction` belongs to a `ClientSubscription`. IremboPay transactions carry the IremboPay `invoiceNumber`, and their status is tracked in `transactionStatus` (`PENDING`, `PAID`, `FAILED`, …).

---

## 6. Key business flows

### 6.1 Authentication
- Configuration lives in `src/common/authOptions.ts`. Sessions are JWTs stored in an HTTP-only cookie and expire after 2 hours.
- **Email/password:** the user signs up at `/auth/sign-up`, which creates the `User` (bcrypt-hashed password) and the `Client`.
- **Google:** on first sign-in a `User` is created automatically, and a `Client` record is created on the next visit to the login page.
- The admin area (`/dashboard/admin`) is protected in its layout. The data behind it is also protected in every server action.

### 6.2 Subscription and payment (IremboPay, live in production)
1. A signed-in client picks a plan at `/subscribe`. The server action `createSubscriptionInvoice()` creates an IremboPay invoice and a `PENDING` transaction.
2. The IremboPay widget opens in the browser and the client pays.
3. IremboPay calls the webhook **`POST /api/irembo-pay/callback`**. The request signature is verified with HMAC-SHA256. The transaction is marked `PAID` and the subscription expiry is extended by the plan duration.
4. As a fallback, the browser polls `checkInvoiceStatus()`, which re-checks the status **directly with IremboPay** (it never trusts the browser).
5. Pending payments can be retried from the client's profile ("Pay Now").

**Configuration requirements**
- Each subscription plan must have an **IremboPay Product Code**, set under Admin → Subscriptions.
- The webhook URL in the IremboPay merchant portal must be `https://weddconnect.com/api/irembo-pay/callback`.
- Prices in USD are converted to RWF at a fixed rate (`USD_TO_RWF_RATE` in `src/common/CommonTypes.ts`).
- Admins can still approve a manual (offline) payment from Admin → Clients → Pending.

Full details are in `docs/irembo-pay/`.

### 6.3 Access to vendor listings
Vendor listings and contacts are the platform's paid content. Only **admins** and **clients with a non-expired subscription** can read them. The rule is enforced in the `/posts` layout, and again in the post server actions and the `/api/post` routes. Clients contact vendors through the contact channels on each listing, including WhatsApp links.

### 6.4 Administration
The admin dashboard (`/dashboard/admin`) provides:
- platform statistics, recent activity, and popular/trending posts (cached on the server);
- management of posts, vendors, services, categories and category features;
- client lists by subscription state, subscription plans, and finance statistics with a transaction list;
- the blog (posts, categories, tags);
- admin users, roles and permissions.

### 6.5 Media
Images are uploaded **through the server** to the object storage bucket (`src/util/s3Helpers.ts`), and only admins can upload or delete them. The allowed image hosts for Next.js image optimisation are set in `next.config.ts`.

---

## 7. Security model

Every exported function in a `"use server"` file is reachable over HTTP, whether or not the UI calls it. For that reason, **every server action checks its caller** using `src/lib/auth-guard.ts`:

| Helper | Used for |
|---|---|
| `requireAdmin()` | All admin create/update/delete operations, and reads of users, clients, vendors, transactions, roles and permissions |
| `requireUser()` | Creating reviews and blog comments (always attributed to the signed-in user) |
| `requireClientAccess(id)` | Reading or updating a client profile (the owner or an admin only; owners can change only name and phone) |
| `requireSubscriberOrAdmin()` | Reading vendor listings |
| `scopePublicQuery()` | Public reads (categories, plans, blog, reviews): removes sensitive fields, caps page size, masks email addresses; non-admins see published blog posts only |

Other security measures:
- Passwords are hashed with bcrypt and are never returned by any action or API.
- The IremboPay webhook is verified with an HMAC signature, and payment status always comes from IremboPay.
- Secrets are server-side only. No secret is stored in a `NEXT_PUBLIC_` variable.
- The API routes that expose personal data (`/api/user`, `/api/client`, `/api/vendor`, `/api/role`, `/api/permission`) require an admin session.

**Pre-handover review.** Before handover, Desc Softlab Ltd reviewed the codebase and applied this permission model to all server actions and API routes. It also removed unused code and cleaned up configuration. Developers adding new server actions **must** follow the same pattern; the rules are summarised in the README under "Security".

---

## 8. Infrastructure, hosting and account ownership

| Service | Purpose | Owner / account holder | Notes |
|---|---|---|---|
| **GitHub** | Source code repository | Enock Niyonzima (Creators Company Ltd) | `main` is the production branch |
| **Vercel** | Application hosting and deployments | Enock Niyonzima (Creators Company Ltd) | Environment variables are managed in the Vercel project settings |
| **Domain** `weddconnect.com` | Production domain | Enock Niyonzima (Creators Company Ltd) | DNS points to Vercel |
| **Google Cloud (OAuth)** | "Sign in with Google" | Enock Niyonzima (Creators Company Ltd) | Authorised redirect URI: `https://weddconnect.com/api/auth/callback/google` |
| **IremboPay** | Payment processing (production) | Enock Niyonzima (Creators Company Ltd) | Merchant account, payment account, product codes, webhook URL |
| **Database** | Desc Managed PostgreSQL | Desc Softlab Ltd (Desc Hosting) | Remains hosted by Desc Hosting; a full backup is provided on request if the client chooses to migrate |
| **Object storage** | Desc Hosting S3 bucket (images) | Desc Softlab Ltd (Desc Hosting) | Remains hosted by Desc Hosting; a full export of all files is provided on request if the client chooses to migrate |

**Migrating the database or storage** (only if the client chooses to):
1. Request a backup from Desc Softlab Ltd: a PostgreSQL dump and/or an export of the bucket contents.
2. Restore them on the new provider.
3. Update `DATABASE_URL` and/or the `AWS_*` variables in Vercel.
4. If the bucket hostname changes, add the new hostname to `images.remotePatterns` in `next.config.ts`. Existing image URLs stored in the database must also be rewritten to the new hostname.
5. Redeploy.

---

## 9. Configuration and credentials

The application is configured entirely through environment variables. `.env.example` lists every variable; the README explains each one. In summary:

| Group | Variables |
|---|---|
| Database | `DATABASE_URL` |
| Authentication | `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Object storage | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`, `AWS_S3_REGION`, `NEXT_PUBLIC_AWS_S3_REGION` |
| Application URLs | `NEXT_PUBLIC_BASE_URL`, `SERVER_API_URL`, `NEXT_PUBLIC_SERVER_API_URL` |
| IremboPay | `IPAY_SECRET_KEY`, `IPAY_ENVIRONMENT`, `IPAY_PAYMENT_ACCOUNT_IDENTIFIER`, `NEXT_PUBLIC_IPAY_PUBLIC_KEY`, `NEXT_PUBLIC_IPAY_ENVIRONMENT`, `NEXT_PUBLIC_IPAY_WIDGET_SRC` |

- In production, `IPAY_ENVIRONMENT` and `NEXT_PUBLIC_IPAY_ENVIRONMENT` are set to `production`. Use `sandbox` and sandbox keys for local development and testing.
- **All credential values are delivered separately and securely.** They must never be committed to the repository or shared in plain text.
- After the handover, the client should rotate the secrets they control (for example `NEXTAUTH_SECRET`, the Google OAuth client secret and the IremboPay keys), as is standard practice. Rotating `NEXTAUTH_SECRET` signs out all users.

---

## 10. Local development setup

**Prerequisites:** Node.js 20 or later (developed on Node 22), npm, and PostgreSQL 14 or later.

```bash
git clone <repository-url> && cd weddconnect
npm install
cp .env.example .env              # fill in local values (sandbox IremboPay keys)
npx prisma migrate deploy         # create the schema in your local database
npx prisma generate
npm run dev                       # http://localhost:3000
```

To give a local account admin access, create an `Admin` row linked to that user's `User.id` (for example with `npx prisma studio`).

**Useful commands**

| Command | Purpose |
|---|---|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` / `npm run start` | Production build / serve |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |
| `npx prisma studio` | Browse and edit the database |
| `npx prisma migrate dev --name <change>` | Create a migration after a schema change |
| `ANALYZE=true npm run build` | Bundle size analysis |

---

## 11. Deployment and release process

- **Production deploys automatically from `main`** through the Vercel–GitHub integration. Other branches and pull requests get Vercel preview deployments.
- The build command is `npm run build`, which runs `prisma generate` and then `next build`.
- **Database migrations are not applied by the build.** When a release changes the Prisma schema, run this against the production database at release time:
  ```bash
  DATABASE_URL="<production url>" npx prisma migrate deploy
  ```
- **Recommended release checklist:**
  1. `npm run lint`, `npx tsc --noEmit` and `npm run build` all pass.
  2. Test the change on a Vercel preview deployment.
  3. Apply migrations if there are any.
  4. Merge to `main`.
  5. Smoke-test production: login, listings, the subscription page and the admin dashboard.
- **Rollback:** use Vercel's "Promote to Production" on the previous deployment. Schema changes that are not backwards-compatible need a manual rollback migration.

---

## 12. Operations

| Topic | Where / how |
|---|---|
| Application logs | Vercel → Project → Logs (server action, webhook and Prisma errors are logged with `console`) |
| Payment issues | Check the transaction in Admin → Finance → Transactions and the invoice in the IremboPay merchant portal. A client can retry a pending payment from their profile, and admins can re-check invoice status from the client list |
| Webhook failures | Look for "IremboPay webhook" entries in the Vercel logs. Confirm the webhook URL and that `IPAY_SECRET_KEY` matches the merchant account |
| Database backups | Handled by Desc Managed PostgreSQL. Backups and restores are provided by Desc Softlab Ltd on request |
| Dashboard statistics | Cached on the server for 1–5 minutes; finance figures refresh automatically after payments |

---

## 13. Known limitations and recommendations

| # | Item | Recommendation |
|---|---|---|
| 1 | **No automated tests.** Quality checks are currently lint, type checking and the build | Add integration tests for the authorization rules and the payment flow first |
| 2 | **Migrations are run manually** at release time | Add `prisma migrate deploy` to the deployment pipeline, or to a release script |
| 3 | **Fixed USD→RWF rate** (`USD_TO_RWF_RATE = 1500`) | Review periodically, move it to configuration, or price plans in RWF |
| 4 | **Session lifetime is 2 hours**, so users sign in again after expiry | Adjust in `authOptions.ts` if the business prefers longer sessions |
| 5 | The **first part of a commenter's email address** (before the @) is shown publicly as their name on blog comments | Add a display-name field to users |
| 6 | **No self-service vendor portal**; vendors are managed by admins | Planned extension; the data model already links vendors to user accounts |
| 7 | Some **`/api/*` read routes** duplicate server actions and are not used by the UI | Keep them protected, or remove them in a future cleanup |
| 8 | Dependencies (Next.js, Prisma, NextAuth v4) will need **regular updates** | Review security advisories monthly; plan the move to Auth.js (NextAuth v5) |

---

## 14. Handover checklist

| Item | Status |
|---|---|
| Source code in the client-owned GitHub repository (`main` = production) | ☐ |
| Vercel project under the client's account, production environment variables configured | ☐ |
| Credentials delivered separately through a secure channel | ☐ |
| IremboPay merchant account (production) under the client's ownership | ☐ |
| Google OAuth application under the client's ownership | ☐ |
| Domain `weddconnect.com` under the client's ownership | ☐ |
| Database and object storage arrangement confirmed (remain on Desc Hosting, or backup provided for migration) | ☐ |
| Documentation delivered (this document, `README.md`, `docs/irembo-pay/`) | ☐ |

---

## 15. Acceptance and sign-off

By signing below, both parties confirm that the WeddConnect source code, documentation and the items in Section 14 have been handed over.

| | Delivered by | Received by |
|---|---|---|
| **Company** | Desc Softlab Ltd | Creators Company Ltd |
| **Name** | Dushime Brother | Enock Niyonzima |
| **Title** | Project Manager | |
| **Signature** | | |
| **Date** | | |

---

*Desc Softlab Ltd · info@descsoftlab.com*
