"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { reconcilePendingIremboTransactions, syncIremboTransaction, TReconcileSummary, TSyncResult } from "@/lib/server/payments";
import { ETransactionStatus } from "@prisma/client";

/** Admin "Reconcile pending" button: verifies every PENDING IremboPay transaction with IremboPay. */
export async function reconcilePendingTransactions(): Promise<{ error?: string; summary?: TReconcileSummary }> {
     try {
          await requireAdmin();
          return { summary: await reconcilePendingIremboTransactions() };
     } catch (error) {
          unstable_rethrow(error);
          console.error("Reconcile pending transactions error:", error);
          return { error: "Reconciliation failed. Please try again." };
     }
}

/**
 * Re-checks one IremboPay transaction (used when an admin opens a pending transaction).
 * Activates the subscription if IremboPay says it's paid, cancels it if it has gone stale.
 */
export async function syncTransactionStatus(id: number): Promise<{
     error?: string;
     state?: TSyncResult["state"];
     transactionStatus?: ETransactionStatus;
     expiryAt?: Date | null;
}> {
     try {
          await requireAdmin();
          const tx = await prisma.transaction.findUnique({
               where: { id },
               select: { id: true, invoiceNumber: true, createdAt: true, transactionStatus: true, provider: true },
          });
          if (!tx) return { error: "Transaction not found" };
          if (tx.provider !== "IREMBO_PAY") return { error: "Not an IremboPay transaction" };

          const r = await syncIremboTransaction(tx);
          const fresh = await prisma.transaction.findUnique({
               where: { id },
               select: { transactionStatus: true, clientSubscription: { select: { expiryAt: true } } },
          });
          return {
               state: r.state,
               transactionStatus: fresh?.transactionStatus,
               expiryAt: fresh?.clientSubscription.expiryAt ?? null,
               error: r.state === "ERROR" ? "Could not reach IremboPay" : undefined,
          };
     } catch (error) {
          unstable_rethrow(error);
          console.error("Sync transaction status error:", error);
          return { error: "Could not check status with IremboPay" };
     }
}
