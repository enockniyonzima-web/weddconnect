import "server-only";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { getDaysCount } from "@/util/DateFunctions";
import { TDurationUnit } from "@/types/common";
import { ETransactionStatus } from "@prisma/client";
import { revalidateFinanceStats } from "@/server-actions/admin-finance";
import { iPay } from "@/config/iremboConfig";
import { IIremboPayInvoice } from "@/types/irembo-pay";

/**
 * How long an IremboPay invoice stays payable. Used both as the invoice's `expiryAt` on IremboPay
 * and as the age after which a still-unpaid PENDING transaction is cancelled on our side.
 * 24h matches common practice for hosted payment links (e.g. Stripe Checkout's default) and
 * comfortably covers mobile-money delays, while keeping abandoned invoices from lingering.
 */
export const PENDING_INVOICE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * An open invoice is only handed back to the client if it has at least this long left to live —
 * enough time to finish a mobile-money payment without the invoice expiring mid-way.
 */
export const REUSE_MIN_REMAINING_MS = 60 * 60 * 1000;

/** A PENDING row that never got an invoice number (invoice creation crashed mid-way) is abandoned after this. */
const ORPHAN_RESERVATION_MS = 5 * 60 * 1000;

export const invoiceExpiryFrom = (createdAt: Date) => new Date(createdAt.getTime() + PENDING_INVOICE_TTL_MS);

/**
 * Single source of truth for turning a confirmed IremboPay payment into an active subscription.
 *
 * Only call this with a payment status that came from IremboPay itself — i.e. from the signed
 * webhook (`/api/irembo-pay/callback`) or from `iPay.invoice.getInvoice()`. It is deliberately
 * kept out of `"use server"` files so the browser can never call it with a forged status.
 *
 * A PAID status always wins, even over a transaction we CANCELLED: if the client managed to pay
 * a closed invoice, they paid and must get what they paid for.
 */
export async function reconcileInvoicePayment(
     invoiceNumber: string,
     paymentStatus: "PAID" | "PARTIALLY_PAID" | "FAILED",
     paymentMethod?: string
) {
     const tx = await prisma.transaction.findUnique({
          where: { invoiceNumber },
          include: { subscription: true, clientSubscription: { include: { subscription: true } } },
     });
     if (!tx) return { error: "Transaction not found for invoice" };
     if (tx.transactionStatus === ETransactionStatus.PAID) return { ok: true }; // already processed

     // Legacy rows have no subscriptionId — fall back to the client's current plan.
     const plan = tx.subscription ?? tx.clientSubscription.subscription;

     await prisma.$transaction(async (db) => {
          // Conditional claim: the webhook and the client's status poll can race on the same
          // invoice. Only the caller that actually flips the row extends the subscription, so a
          // payment can never be credited twice.
          const claimed = await db.transaction.updateMany({
               where: { id: tx.id, transactionStatus: { not: ETransactionStatus.PAID } },
               data: { transactionStatus: paymentStatus, status: paymentStatus.toLowerCase(), paymentMethod, pendingKey: null },
          });
          if (claimed.count === 0 || paymentStatus !== "PAID") return;

          const current = await db.clientSubscription.findUniqueOrThrow({ where: { id: tx.clientSubscriptionId }, select: { expiryAt: true } });
          const days = getDaysCount(plan.duration, plan.durationUnit as TDurationUnit);
          const now = new Date();
          const base = current.expiryAt && current.expiryAt > now ? current.expiryAt : now;
          const expiryAt = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
          await db.clientSubscription.update({
               where: { id: tx.clientSubscriptionId },
               data: { expiryAt, subscriptionId: plan.id, updatedAt: now },
          });
     });

     RevalidatePages.clientSubscription();
     RevalidatePages.transaction();
     await revalidateFinanceStats();
     return { ok: true };
}

/**
 * Closes an invoice on IremboPay. There is no cancel endpoint, so we pull its expiry in to (almost)
 * now. If the invoice has already expired on IremboPay we leave it alone — pushing the expiry to
 * "now + 1 min" would actually re-open an already-dead invoice.
 */
async function expireIremboInvoice(invoiceNumber: string, currentExpiryAt?: string | null): Promise<boolean> {
     if (currentExpiryAt && new Date(currentExpiryAt).getTime() <= Date.now()) return true;
     try {
          const res = await iPay.invoice.updateInvoice(invoiceNumber, { expiryAt: new Date(Date.now() + 60 * 1000).toISOString() });
          if (!res?.success) console.warn("IremboPay updateInvoice (expire) rejected:", invoiceNumber, res?.message, res?.errors);
          return !!res?.success;
     } catch (error) {
          console.warn("IremboPay updateInvoice (expire) error:", invoiceNumber, error);
          return false;
     }
}

/** Marks a PENDING transaction closed. Conditional, so it never overwrites a PAID set concurrently by the webhook. */
async function closePendingTransaction(id: number, status: "CANCELLED" | "FAILED") {
     const res = await prisma.transaction.updateMany({
          where: { id, transactionStatus: ETransactionStatus.PENDING },
          data: { transactionStatus: status, status: status.toLowerCase(), pendingKey: null },
     });
     return res.count === 1;
}

export async function failReservation(id: number) {
     await closePendingTransaction(id, "FAILED");
}

type TSyncable = { id: number; invoiceNumber: string | null; createdAt: Date; transactionStatus: ETransactionStatus };

export type TSyncResult =
     | { state: "PAID" | "PARTIALLY_PAID"; invoice: IIremboPayInvoice }
     | { state: "PENDING"; invoice: IIremboPayInvoice | null } // still open and payable
     | { state: "CANCELLED"; invoice: IIremboPayInvoice | null }
     | { state: "UNCHANGED"; invoice: IIremboPayInvoice } // not PENDING locally and not paid on IremboPay
     | { state: "ERROR"; invoice: null }; // IremboPay could not be reached — nothing was changed

export async function fetchIremboInvoice(invoiceNumber: string): Promise<IIremboPayInvoice | null> {
     try {
          const res = await iPay.invoice.getInvoice(invoiceNumber);
          return res?.data ?? null;
     } catch (error) {
          console.warn("IremboPay getInvoice error:", invoiceNumber, error);
          return null;
     }
}

/**
 * Brings one IremboPay transaction in line with IremboPay:
 *  - paid on IremboPay           → reconciled (subscription activated/extended)
 *  - unpaid and older than TTL   → closed on IremboPay and CANCELLED here
 *  - unpaid and still fresh      → left PENDING
 * Nothing is cancelled unless IremboPay has positively confirmed the invoice is unpaid.
 */
export async function syncIremboTransaction(tx: TSyncable): Promise<TSyncResult> {
     const age = Date.now() - tx.createdAt.getTime();

     if (!tx.invoiceNumber) {
          if (tx.transactionStatus === ETransactionStatus.PENDING && age >= ORPHAN_RESERVATION_MS) {
               await closePendingTransaction(tx.id, "CANCELLED");
               return { state: "CANCELLED", invoice: null };
          }
          return { state: "PENDING", invoice: null };
     }

     const invoice = await fetchIremboInvoice(tx.invoiceNumber);
     if (!invoice) return { state: "ERROR", invoice: null };

     const paid = invoice.paymentStatus === "PAID" ? "PAID" : invoice.paymentStatus === "PARTIALLY_PAID" ? "PARTIALLY_PAID" : null;
     if (paid) {
          await reconcileInvoicePayment(tx.invoiceNumber, paid, invoice.paymentMethod);
          return { state: paid, invoice };
     }

     if (tx.transactionStatus !== ETransactionStatus.PENDING) return { state: "UNCHANGED", invoice };

     if (age >= PENDING_INVOICE_TTL_MS) {
          await cancelOpenTransaction({ ...tx, invoiceNumber: tx.invoiceNumber }, invoice);
          return { state: "CANCELLED", invoice };
     }
     return { state: "PENDING", invoice };
}

/** Closes an unpaid invoice on IremboPay (best effort) and marks it CANCELLED here. */
export async function cancelOpenTransaction(tx: { id: number; invoiceNumber: string }, invoice: IIremboPayInvoice | null) {
     // Even if IremboPay refuses the expiry update we still cancel locally: should the client pay
     // that invoice anyway, the webhook/reconcile path honours the payment (PAID always wins).
     await expireIremboInvoice(tx.invoiceNumber, invoice?.expiryAt);
     return closePendingTransaction(tx.id, "CANCELLED");
}

/** Time an open invoice has left before it stops being payable. */
export function invoiceRemainingMs(tx: { createdAt: Date }, invoice: IIremboPayInvoice | null) {
     const expiry = invoice?.expiryAt ? new Date(invoice.expiryAt) : invoiceExpiryFrom(tx.createdAt);
     return expiry.getTime() - Date.now();
}

export type TReconcileSummary = { checked: number; paid: number; cancelled: number; stillPending: number; errors: number; remaining: number };

/**
 * Sweeps PENDING IremboPay transactions (oldest first) through `syncIremboTransaction`.
 * Batched and lightly parallel so a single admin click stays within serverless time limits;
 * `remaining` tells the caller whether another run is needed.
 */
export async function reconcilePendingIremboTransactions(batchSize = 60, concurrency = 5): Promise<TReconcileSummary> {
     const where = { provider: "IREMBO_PAY" as const, transactionStatus: ETransactionStatus.PENDING };
     const txs = await prisma.transaction.findMany({
          where,
          orderBy: { createdAt: "asc" },
          take: batchSize,
          select: { id: true, invoiceNumber: true, createdAt: true, transactionStatus: true },
     });

     const summary: TReconcileSummary = { checked: 0, paid: 0, cancelled: 0, stillPending: 0, errors: 0, remaining: 0 };
     let cursor = 0;
     const worker = async () => {
          while (cursor < txs.length) {
               const tx = txs[cursor++];
               const r = await syncIremboTransaction(tx);
               summary.checked++;
               if (r.state === "PAID" || r.state === "PARTIALLY_PAID") summary.paid++;
               else if (r.state === "CANCELLED") summary.cancelled++;
               else if (r.state === "ERROR") summary.errors++;
               else summary.stillPending++;
          }
     };
     await Promise.all(Array.from({ length: Math.min(concurrency, txs.length) }, worker));

     // Rows we couldn't resolve this run (still fresh, or IremboPay unreachable) stay PENDING, so
     // only count what's left beyond this batch.
     const pendingNow = await prisma.transaction.count({ where });
     summary.remaining = Math.max(0, pendingNow - summary.stillPending - summary.errors);

     RevalidatePages.transaction();
     RevalidatePages.clientSubscription();
     await revalidateFinanceStats();
     return summary;
}
