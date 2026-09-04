# Step 6 — Admin dashboard improvements

The live pending-clients admin UI is `src/components/containers/ClientsContainer.tsx` (`ClientCard`), rendered from `dashboard/admin/clients/pending|active|expired|no-subscriptions/page.tsx` via `AdminClientSelect`. (Note: `dashboard/admin/clients/pending/ClientsTable.tsx` looks like an equivalent but is dead code — nothing imports it — so it was left untouched rather than "fixed"; it's not on the real code path.)

Good news on inspection: `ClientCard`'s renew/create/approve handlers already compute expiry correctly from the plan's real `duration`/`durationUnit` via `getDaysCount()` — there was no hardcoded-90/1000-day bug in the live path (that bug only existed in the dead `ClientsTable.tsx`), so nothing needed fixing there.

## What was added
- `AdminClientSelect` (`dashboard/admin/clients/select-types.ts`) now also selects `provider` and `invoiceNumber` on the latest transaction.
- Each pending transaction card now shows a **provider badge** (`IremboPay` vs `Manual`) so admins can tell gateway-confirmed-but-stuck payments apart from old-style manual/cash entries.
- For `IREMBO_PAY` transactions, a **"Verify with IremboPay"** button calls the same `checkInvoiceStatus()` action used by the client poll — it re-checks the real invoice status with IremboPay and, if paid, reconciles it (activates the subscription) instead of the admin blindly trusting the pending row and clicking the old manual "Approve" button. "Approve"/"Reject" remain available as a manual override for edge cases (e.g. cash payments, or a payment IremboPay confirms was never actually captured by our webhook for some other reason).

In practice, once IremboPay is live, this pending list should rarely have entries — a transaction only stays `PENDING` if the user abandoned checkout or a webhook was missed, both fixable with the verify button instead of admin guesswork.
