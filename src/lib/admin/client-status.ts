// One source of truth for "which list does this client belong to". Every client lands in exactly
// one status, evaluated against the current moment (not midnight), so a plan that expired at
// 09:00 today is already "expired" at 09:01 — and moves lists as soon as an admin changes it.
import type { Prisma } from "@prisma/client";

export type ClientStatus = "active" | "expiring" | "pending" | "expired" | "inactive" | "none";

export const EXPIRING_SOON_DAYS = 7;

export const CLIENT_STATUS_META: Record<ClientStatus, { label: string; short: string; description: string; tone: "green" | "amber" | "blue" | "red" | "gray" | "slate"; href: string }> = {
     active: { label: "Active", short: "Active", description: "Plan is paid and has not expired yet. These clients have full access.", tone: "green", href: "/dashboard/admin/clients/active" },
     expiring: { label: "Expiring soon", short: "Expiring", description: `Active right now, but the plan ends within the next ${EXPIRING_SOON_DAYS} days. A good list to call for renewals. (Also counted in Active.)`, tone: "amber", href: "/dashboard/admin/clients/expiring" },
     pending: { label: "Awaiting payment", short: "Pending", description: "Client has started a payment or sent a payment request that has not been confirmed yet, and has no running plan.", tone: "blue", href: "/dashboard/admin/clients/pending" },
     expired: { label: "Expired", short: "Expired", description: "Client had a plan but its end date has passed and no new payment is waiting.", tone: "red", href: "/dashboard/admin/clients/expired" },
     inactive: { label: "Cancelled / not started", short: "Inactive", description: "Client picked a plan but it was cancelled, rejected, or never activated, and no payment is waiting.", tone: "gray", href: "/dashboard/admin/clients/inactive" },
     none: { label: "No plan", short: "No plan", description: "Client signed up but never chose a subscription plan.", tone: "slate", href: "/dashboard/admin/clients/no-subscriptions" },
};

/** An open payment: IremboPay invoice not yet settled, or a manual payment request not yet reviewed. */
export const PENDING_TX_WHERE = {
     OR: [
          { transactionStatus: "PENDING" },
          { transactionStatus: "NONE", status: { equals: "pending", mode: "insensitive" } },
     ],
} satisfies Prisma.TransactionWhereInput;

/**
 * Money actually received. `transactionStatus` is the reliable field; older manual records only
 * carry the free-text `status` ("Approved"/"verified"/"paid") with transactionStatus NONE.
 */
export const REVENUE_TX_WHERE = {
     OR: [
          { transactionStatus: "PAID" },
          {
               transactionStatus: "NONE",
               OR: ["approved", "verified", "paid"].map((s) => ({ status: { equals: s, mode: "insensitive" as const } })),
          },
     ],
} satisfies Prisma.TransactionWhereInput;

/** Prisma filter for each status (mutually exclusive, except "expiring" which is a slice of "active"). */
export function clientStatusWhere(status: ClientStatus | "all", now = new Date()): Prisma.ClientWhereInput {
     const soon = new Date(now.getTime() + EXPIRING_SOON_DAYS * 86_400_000);
     const hasPending: Prisma.ClientWhereInput = { subscription: { is: { transactions: { some: PENDING_TX_WHERE } } } };
     switch (status) {
          case "active":
               return { subscription: { is: { expiryAt: { gt: now } } } };
          case "expiring":
               return { subscription: { is: { expiryAt: { gt: now, lte: soon } } } };
          case "pending":
               return {
                    AND: [
                         { subscription: { is: { OR: [{ expiryAt: null }, { expiryAt: { lte: now } }] } } },
                         hasPending,
                    ],
               };
          case "expired":
               return { AND: [{ subscription: { is: { expiryAt: { lte: now } } } }, { NOT: hasPending }] };
          case "inactive":
               return { AND: [{ subscription: { is: { expiryAt: null } } }, { NOT: hasPending }] };
          case "none":
               return { subscription: { is: null } };
          default:
               return {};
     }
}

/** Same classification for a single loaded client (used for badges in lists). */
export function classifyClient(sub: { expiryAt: Date | string | null; hasPendingPayment: boolean } | null, now = new Date()): ClientStatus {
     if (!sub) return "none";
     const expiry = sub.expiryAt ? new Date(sub.expiryAt) : null;
     if (expiry && expiry > now) return expiry.getTime() - now.getTime() <= EXPIRING_SOON_DAYS * 86_400_000 ? "expiring" : "active";
     if (sub.hasPendingPayment) return "pending";
     return expiry ? "expired" : "inactive";
}

export const isPendingTx = (t: { transactionStatus?: string | null; status?: string | null }) =>
     t.transactionStatus === "PENDING" || (t.transactionStatus === "NONE" && t.status?.toLowerCase() === "pending");
