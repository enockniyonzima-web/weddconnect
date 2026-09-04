# Step 7 — Testing guide (for you to run)

## Before you start
1. Add `NEXT_PUBLIC_IPAY_ENVIRONMENT=sandbox` to `.env` (new — see [04-client-flow.md](04-client-flow.md)). Keep it in sync with `IPAY_ENVIRONMENT`.
2. In the admin dashboard → Subscriptions, edit each plan and fill in **IremboPay Product Code** with the product code you created in the IremboPay sandbox portal for that plan. Invoice creation will fail with "This plan is not yet configured for payment" until this is set.
3. Make sure your IremboPay sandbox portal's callback URL points to `https://<your-ngrok-domain>/api/irembo-pay/callback` (the `allowedDevOrigins` entry in `next.config.ts` suggests you already have a tunnel — just confirm the callback path).
4. Run `npx prisma generate` if you haven't since pulling the schema changes (already generated in this environment, but re-run if you regenerate elsewhere).

## Test matrix (sandbox)
| Scenario | How | Expect |
|---|---|---|
| Successful MoMo payment | Pay with MTN test number `0781234567` | Widget closes → "Confirming..." → subscription active within a few seconds |
| Failed MoMo payment | Pay with MTN test number `0780123456` | Poll times out after ~60s → "Payment Not Confirmed" screen with Try Again |
| Successful card payment | Visa `4242 4242 4242 4242`, `01/35`, `123` | Same as successful MoMo |
| Failed card payment | Card `5198 9602 2985 7244` | Same as failed MoMo |
| Webhook idempotency | Manually replay the same webhook payload (e.g. via curl) after a successful payment | Second call is a no-op (subscription expiry doesn't extend twice) |
| Signature tampering | Send a POST to `/api/irembo-pay/callback` with a wrong/missing `irembopay-signature` header | `401`, nothing changes in the DB |
| Renewal while still active | Pay again before the current plan expires | New expiry stacks on top of the current one, doesn't reset to "now + duration" |
| Missed webhook | Temporarily point the portal callback URL somewhere wrong, then pay | Client-side poll (`checkInvoiceStatus`) still activates the subscription within ~60s since it independently re-checks with IremboPay |
| Admin manual verify | Let a payment sit as `PENDING` in the admin pending-clients list, click "Verify with IremboPay" | If actually paid, activates immediately; if not, shows the real IremboPay status |

## Go-live checklist (once sandbox testing passes)
1. Swap `IPAY_SECRET_KEY`, `NEXT_PUBLIC_IPAY_PUBLIC_KEY`, `IPAY_PAYMENT_ACCOUNT_IDENTIFIER` to production values.
2. Set `IPAY_ENVIRONMENT=production` and `NEXT_PUBLIC_IPAY_ENVIRONMENT=production`.
3. Re-register the production callback URL (your real domain, not ngrok) in the IremboPay production portal.
4. Re-enter each plan's **production** `iremboProductCode` in the admin Subscriptions form (sandbox and production product codes are different).
5. Run one real low-value transaction end-to-end before announcing it to users.
6. Watch server logs for `IremboPay webhook: invalid signature` in the first days — a flood of these usually means the secret key or callback URL is misconfigured, not an attack.
