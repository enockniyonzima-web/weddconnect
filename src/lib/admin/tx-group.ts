// Plain-language result of a payment, shared by reports and lists so they always agree.
import type { ETransactionStatus } from "@prisma/client";
import { isPendingTx } from "./client-status";

export type TxGroup = "paid" | "pending" | "failed" | "partial" | "other";

/** Mirrors REVENUE_TX_WHERE / PENDING_TX_WHERE for rows already loaded into memory. */
export function txGroup(t: { transactionStatus: ETransactionStatus; status: string }): TxGroup {
     const legacy = t.status?.toLowerCase();
     if (t.transactionStatus === "PAID") return "paid";
     if (t.transactionStatus === "PARTIALLY_PAID") return "partial";
     if (["FAILED", "EXPIRED", "CANCELLED"].includes(t.transactionStatus)) return "failed";
     if (isPendingTx(t)) return "pending";
     if (t.transactionStatus === "NONE") {
          if (["approved", "verified", "paid"].includes(legacy)) return "paid";
          if (["rejected", "failed", "cancelled"].includes(legacy)) return "failed";
     }
     return "other";
}

