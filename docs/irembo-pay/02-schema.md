# Step 3 — Schema changes

Migration: `prisma/migrations/20260707063930_updates_transaction_irembo/`

## `Subscription`
- `iremboProductCode String?` — the product code registered for this plan in the IremboPay portal, sent as `paymentItems[].code` when creating an invoice.

## `Transaction`
- `invoiceNumber String? @unique` — IremboPay's invoice number; the join key used by the webhook to find the transaction to update.
- `paymentMethod String?` — e.g. `MOMO_PUSH`, `CARD`, filled in from the webhook payload.
- `provider ETransactionProvider @default(MANUAL)` — `MANUAL` | `IREMBO_PAY`. Lets the admin dashboard tell gateway-paid transactions apart from the old self-reported ones.
- `transactionStatus ETransactionStatus @default(NONE)` — `NONE | PENDING | PAID | PARTIALLY_PAID | FAILED | EXPIRED`. This is the gateway state machine; the legacy `status String` field is left untouched (still used by old manual-flow code/UI) and is kept in sync in parallel rather than replaced, to avoid touching every existing read site.

Both new enums (`ETransactionProvider`, `ETransactionStatus`) and columns are additive — no existing rows/queries break.
