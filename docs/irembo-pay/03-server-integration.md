# Step 4 — Server integration

## `src/server-actions/irembo-pay/invoice.ts`

- **`createSubscriptionInvoice(subscriptionId, phone?)`** — the entry point called from the client checkout UI.
  1. Loads the plan; requires `iremboProductCode` to be set (configured per-plan in the IremboPay portal).
  2. Resolves/creates the `Client` row (a phone number is required the first time, same constraint the old manual flow had).
  3. Converts price to RWF only if the plan isn't already priced in RWF (`USD_TO_RWF_RATE` in `common/CommonTypes.ts`).
  4. Calls `iPay.invoice.createInvoice(...)`, then creates/updates the `ClientSubscription` + a `Transaction` row (`provider: IREMBO_PAY`, `transactionStatus: PENDING`, `invoiceNumber` set) — mirrors the shape of the old manual submit, just swapping the source of the transaction record.
  5. Returns `{ invoiceNumber, paymentLinkUrl }` to the browser.

- **`reconcileInvoicePayment(invoiceNumber, paymentStatus, paymentMethod?)`** — the single place that turns a confirmed payment into an active subscription. Idempotent: no-ops if the transaction is already `PAID`. On `PAID`, extends `ClientSubscription.expiryAt` using the plan's real `duration`/`durationUnit` (via the existing `getDaysCount()` helper) — stacking onto the current expiry if still active, otherwise from now. Used by **both** the webhook and the client-side poll below, so there is exactly one code path that grants access.

- **`checkInvoiceStatus(invoiceNumber)`** — client-callable action used for the safety-net poll (see step 5). It re-fetches the invoice from IremboPay directly and, if paid, calls `reconcileInvoicePayment`. It never trusts anything the browser reports — it always re-asks IremboPay.

## `src/app/api/irembo-pay/callback/route.ts` (webhook)
Rewritten from scratch — the previous version was leftover boilerplate from a different provider ("IntouchPay") and didn't match IremboPay's payload at all.

- Reads the **raw** request body (`req.text()`) because signature verification is computed over the exact raw bytes — parsing JSON first would break it.
- Verifies `irembopay-signature` via `verifyIremboSignature`; returns `401` if invalid (this is the one case we don't want to just swallow — it means either a misconfigured secret or a spoofed request).
- Delegates the actual state change to `reconcileInvoicePayment`, so the webhook contains no business logic of its own.
- Any unexpected error is caught and still answers `200` (documented convention: don't let the provider hammer us with retries over our own bugs), but logs the error server-side.
