# IremboPay Integration — Progress

Replacing the manual (self-reported) subscription payment flow with IremboPay.

| # | Step | Status | Notes |
|---|------|--------|-------|
| 1 | Portal setup (merchant account, payment account, product, callback URL) | ✅ Done | Done by user in IremboPay dashboard |
| 2 | Env vars + SDK config (`src/config/iremboConfig.ts`) | ✅ Done | See [01-config-env.md](01-config-env.md) |
| 3 | Prisma schema (`Transaction`/`Subscription` fields, migration) | ✅ Done | See [02-schema.md](02-schema.md) |
| 4 | Server integration: create-invoice action + webhook handler | ✅ Done | See [03-server-integration.md](03-server-integration.md) |
| 5 | Client checkout flow (`ClientSubscriptionView.tsx`) | ✅ Done | See [04-client-flow.md](04-client-flow.md) |
| 6 | Admin dashboard improvements | ✅ Done | See [05-admin-dashboard.md](05-admin-dashboard.md) |
| 7 | Testing → go-live | 🔲 Ready for you | See [06-testing-guide.md](06-testing-guide.md) |

## Action needed from you before testing
- Add `NEXT_PUBLIC_IPAY_ENVIRONMENT=sandbox` to `.env` (new var, needed by the browser widget — see doc 04).
- Set each Subscription plan's **IremboPay Product Code** in the admin dashboard (Subscriptions → edit plan) — a field that didn't previously exist on the form.

Full project `tsc --noEmit` and `eslint` both pass clean as of this update.

## Post-launch addition: retry payment from profile
`src/app/profile/page.tsx`'s transaction list now shows a **"Pay Now"** button (`RetryPaymentBtn.tsx`) on any `IREMBO_PAY` transaction still `PENDING` (e.g. user closed the widget without paying). It always calls `checkInvoiceStatus()` first to re-verify with IremboPay before reopening the widget — if it turns out already paid, it reconciles and refreshes instead of charging again. Widget-loading/polling logic was extracted from `ClientSubscriptionView.tsx` into `src/util/iremboWidget.ts` so both places share the same code instead of duplicating it.

Last updated: 2026-07-10
