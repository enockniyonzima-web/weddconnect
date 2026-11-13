import "server-only";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { getDaysCount } from "@/util/DateFunctions";
import { TDurationUnit } from "@/types/common";
import { ETransactionStatus } from "@prisma/client";
import { revalidateFinanceStats } from "@/server-actions/admin-finance";

/**
 * Single source of truth for turning a confirmed IremboPay payment into an active subscription.
 *
 * Only call this with a payment status that came from IremboPay itself — i.e. from the signed
 * webhook (`/api/irembo-pay/callback`) or from `iPay.invoice.getInvoice()`. It is deliberately
 * kept out of `"use server"` files so the browser can never call it with a forged status.
 */
export async function reconcileInvoicePayment(
     invoiceNumber: string,
     paymentStatus: "PAID" | "PARTIALLY_PAID" | "FAILED",
     paymentMethod?: string
) {
     const tx = await prisma.transaction.findUnique({
          where: { invoiceNumber },
          include: { clientSubscription: { include: { subscription: true } } },
     });
     if (!tx) return { error: "Transaction not found for invoice" };
     if (tx.transactionStatus === ETransactionStatus.PAID) return { ok: true }; // already processed

     await prisma.transaction.update({
          where: { id: tx.id },
          data: { transactionStatus: paymentStatus, status: paymentStatus.toLowerCase(), paymentMethod },
     });

     if (paymentStatus === "PAID") {
          const plan = tx.clientSubscription.subscription;
          const days = getDaysCount(plan.duration, plan.durationUnit as TDurationUnit);
          const currentExpiry = tx.clientSubscription.expiryAt;
          const base = currentExpiry && currentExpiry > new Date() ? currentExpiry : new Date();
          const expiryAt = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
          await prisma.clientSubscription.update({ where: { id: tx.clientSubscriptionId }, data: { expiryAt, updatedAt: new Date() } });
     }

     RevalidatePages.clientSubscription();
     RevalidatePages.transaction();
     await revalidateFinanceStats();
     return { ok: true };
}
