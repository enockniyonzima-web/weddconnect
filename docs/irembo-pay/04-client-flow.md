# Step 5 — Client checkout flow

## Safest approach: widget + server-verified polling (not a hosted redirect)

Two options were possible: redirect the whole page to IremboPay's hosted `paymentLinkUrl`, or embed their JS widget in our existing modal. **We used the widget**, because:

- IremboPay's Create Invoice API has **no `returnUrl`/`redirectUrl` field** — a full-page redirect to the hosted checkout has no documented way to bring the user back to WeddConnect afterwards. The widget's in-page `callback` is the only documented mechanism for resuming control after checkout.
- Either way, the widget's client-side callback is **not proof of payment** — IremboPay doesn't sign or authenticate it. So the safety-critical part is identical regardless of widget vs. redirect: never grant access from something the browser tells you.

So the actual safety model is:
1. The widget is UX only — it tells us "the user is done interacting", nothing more.
2. On that callback, we start a **poll** (`checkInvoiceStatus`, every 3s for ~60s) that calls IremboPay's Get Invoice API **from the server**, and reuses the exact same `reconcileInvoicePayment` used by the webhook — so whichever arrives first (webhook or poll) activates the subscription, and the other becomes a no-op (idempotent on `transactionStatus`).
3. The webhook remains the primary/authoritative path; the poll is purely a fallback in case a webhook is delayed or dropped.

## `ClientSubscriptionView.tsx` changes
Steps 2–3 (pick a manual account, self-report a pay number) are replaced with:
- **Step 2**: single phone number field → `createSubscriptionInvoice()` → load the IremboPay inline script (`dashboard.sandbox.irembopay.com` / `dashboard.irembopay.com` depending on `NEXT_PUBLIC_IPAY_ENVIRONMENT`) → `IremboPay.initiate()`.
- **Step 3**: "Confirming your payment..." spinner while the poll runs.
- **Step 4**: success (subscription is already active by the time this shows, since it only shows once the poll/webhook confirmed it).
- **Step 5**: not confirmed within ~60s — offer retry or a call-us fallback (payment may still complete later via the webhook even after this shows; the "Try Again" path is a fresh invoice, not a lost payment).

The old day-long "pending verification" lock (in both this file and `subscribe/page.tsx`) was removed — it assumed slow manual review, which no longer applies with instant gateway confirmation.

## One more env var needed
`NEXT_PUBLIC_IPAY_ENVIRONMENT` (`sandbox` or `production`) — used client-side to pick the correct widget script URL. Not part of the step-2 list originally, but required for the widget to load the right script. Add it alongside the existing `IPAY_*` vars.
