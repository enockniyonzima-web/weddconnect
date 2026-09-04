# Step 2 — Env vars & SDK config

## Env vars (`.env`)
- `IPAY_SECRET_KEY` — server-only secret key, used to sign/authenticate API calls and verify webhook signatures. Never exposed to the client.
- `NEXT_PUBLIC_IPAY_PUBLIC_KEY` — public key, used by the browser widget only.
- `IPAY_ENVIRONMENT` — `sandbox` or `production`.
- `IPAY_PAYMENT_ACCOUNT_IDENTIFIER` — the payment account created in the IremboPay portal that determines deposit destination + currency (RWF).

## `src/config/iremboConfig.ts`
Mirrors the existing `awsConfig.ts` pattern: one singleton client instance, exported constants, nothing else.

- `iPay` — singleton `IremboPay` SDK instance (`new IremboPay(secretKey, environment)`), reused by every server action/route instead of re-instantiating per request.
- `IPAY_PAYMENT_ACCOUNT_IDENTIFIER` — re-exported env constant for convenience.
- `verifyIremboSignature(rawBody, signatureHeader)` — the installed SDK (`@irembo/irembopay-node-sdk@1.0.0`) has **no** signature-verification helper, so this is implemented by hand per IremboPay's documented algorithm: `HMAC_SHA256(secretKey, "<timestamp>#<rawBody>")`, compared against the header's signature using a timing-safe comparison. Lives here (not in the webhook route) so it's testable and reusable.

Note: the installed SDK hardcodes `X-API-Version: 2` and types a couple of fields as `number` where the live API expects strings — harmless for the calls we use (`createInvoice`, `getInvoice`, `mobileMoney.initiatePayment` are unaffected by the v2→v3 bump), so we keep the SDK rather than hand-rolling HTTP calls, and only patch around the one real gap (signatures).
