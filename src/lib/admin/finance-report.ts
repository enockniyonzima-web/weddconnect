import "server-only";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { REVENUE_TX_WHERE, PENDING_TX_WHERE } from "./client-status";
import { ResolvedRange, rangeFilter, pickGranularity, buildBuckets, bucketKey, toKigaliDateStr, percentChange, Granularity } from "./date-range";

export { txGroup, type TxGroup } from "./tx-group";
import { txGroup, type TxGroup } from "./tx-group";

const monthsInTerm = (duration: number, unit: string) => {
     const u = unit.toLowerCase();
     if (u.startsWith("year")) return duration * 12;
     if (u.startsWith("month")) return duration;
     if (u.startsWith("week")) return (duration * 7) / 30.44;
     if (u.startsWith("day")) return duration / 30.44;
     return duration;
};

export interface FinanceReport {
     range: ResolvedRange;
     granularity: Granularity;
     revenue: number;
     paidCount: number;
     averagePayment: number;
     payingClients: number;
     pendingAmount: number;
     pendingCount: number;
     failedCount: number;
     partialCount: number;
     totalAttempts: number;
     successRate: number | null;
     previous: { revenue: number; paidCount: number; revenueChange: number | null; paidCountChange: number | null } | null;
     outstandingPendingAmount: number;
     outstandingPendingCount: number;
     monthlyRecurringRevenue: number;
     activeSubscribers: number;
     series: { key: string; label: string; revenue: number; count: number }[];
     byStatus: { group: TxGroup; label: string; count: number; amount: number }[];
     byPlan: { planId: number | null; name: string; amount: number; count: number }[];
     byMethod: { name: string; amount: number; count: number }[];
     topClients: { clientId: number; name: string; amount: number; count: number }[];
     bestBucket: { label: string; revenue: number } | null;
}

const STATUS_LABELS: Record<TxGroup, string> = { paid: "Paid", pending: "Awaiting payment", failed: "Failed / cancelled", partial: "Partially paid", other: "Other" };

export async function fetchFinanceReport(range: ResolvedRange): Promise<FinanceReport> {
     await requireAdmin();
     const now = new Date();
     const createdAt = rangeFilter(range);

     const [rows, prevAgg, outstanding, activeSubs] = await Promise.all([
          prisma.transaction.findMany({
               where: { createdAt },
               select: {
                    amount: true, createdAt: true, transactionStatus: true, status: true, provider: true, paymentMethod: true, transactionMethod: true,
                    subscriptionId: true,
                    clientSubscription: { select: { subscriptionId: true, clientId: true, client: { select: { name: true } } } },
               },
               orderBy: { createdAt: "asc" },
          }),
          range.previous
               ? prisma.transaction.aggregate({ _sum: { amount: true }, _count: true, where: { AND: [REVENUE_TX_WHERE, { createdAt: { gte: range.previous.from, lt: range.previous.to } }] } })
               : Promise.resolve(null),
          prisma.transaction.aggregate({ _sum: { amount: true }, _count: true, where: PENDING_TX_WHERE }),
          prisma.clientSubscription.findMany({ where: { expiryAt: { gt: now } }, select: { subscription: { select: { price: true, duration: true, durationUnit: true } } } }),
     ]);

     const fromStr = range.fromStr ?? (rows[0] ? toKigaliDateStr(rows[0].createdAt) : range.toStr);
     const granularity = pickGranularity(fromStr, range.toStr);
     const buckets = buildBuckets(fromStr, range.toStr, granularity);
     const seriesMap = new Map(buckets.map((b) => [b.key, { ...b, revenue: 0, count: 0 }]));

     const statusMap = new Map<TxGroup, { count: number; amount: number }>();
     const planMap = new Map<number | null, { amount: number; count: number }>();
     const methodMap = new Map<string, { amount: number; count: number }>();
     const clientMap = new Map<number, { name: string; amount: number; count: number }>();

     let revenue = 0, paidCount = 0, pendingAmount = 0, pendingCount = 0, failedCount = 0, partialCount = 0;

     for (const t of rows) {
          const g = txGroup(t);
          const s = statusMap.get(g) ?? { count: 0, amount: 0 };
          s.count += 1;
          s.amount += t.amount;
          statusMap.set(g, s);

          if (g === "pending") { pendingAmount += t.amount; pendingCount += 1; }
          if (g === "failed") failedCount += 1;
          if (g === "partial") partialCount += 1;
          if (g !== "paid") continue;

          revenue += t.amount;
          paidCount += 1;

          const bucket = seriesMap.get(bucketKey(t.createdAt, granularity));
          if (bucket) { bucket.revenue += t.amount; bucket.count += 1; }

          // Attribute revenue to the plan the payment was FOR, falling back to the client's current plan.
          const planId = t.subscriptionId ?? t.clientSubscription.subscriptionId ?? null;
          const p = planMap.get(planId) ?? { amount: 0, count: 0 };
          p.amount += t.amount; p.count += 1;
          planMap.set(planId, p);

          const method = t.provider === "IREMBO_PAY"
               ? `IremboPay${t.paymentMethod ? ` · ${t.paymentMethod.replace(/_/g, " ").toLowerCase()}` : ""}`
               : `Manual${t.transactionMethod ? ` · ${t.transactionMethod}` : ""}`;
          const m = methodMap.get(method) ?? { amount: 0, count: 0 };
          m.amount += t.amount; m.count += 1;
          methodMap.set(method, m);

          const c = clientMap.get(t.clientSubscription.clientId) ?? { name: t.clientSubscription.client.name, amount: 0, count: 0 };
          c.amount += t.amount; c.count += 1;
          clientMap.set(t.clientSubscription.clientId, c);
     }

     const planIds = [...planMap.keys()].filter((id): id is number => id !== null);
     const plans = planIds.length ? await prisma.subscription.findMany({ where: { id: { in: planIds } }, select: { id: true, name: true } }) : [];
     const planNames = new Map(plans.map((p) => [p.id, p.name]));

     const series = [...seriesMap.values()];
     const best = series.reduce<(typeof series)[number] | null>((a, b) => (b.revenue > (a?.revenue ?? 0) ? b : a), null);

     const decided = paidCount + failedCount;
     const prevRevenue = prevAgg?._sum.amount ?? 0;
     const prevCount = prevAgg?._count ?? 0;

     return {
          range,
          granularity,
          revenue,
          paidCount,
          averagePayment: paidCount ? revenue / paidCount : 0,
          payingClients: clientMap.size,
          pendingAmount,
          pendingCount,
          failedCount,
          partialCount,
          totalAttempts: rows.length,
          successRate: decided ? (paidCount / decided) * 100 : null,
          previous: prevAgg ? { revenue: prevRevenue, paidCount: prevCount, revenueChange: percentChange(revenue, prevRevenue), paidCountChange: percentChange(paidCount, prevCount) } : null,
          outstandingPendingAmount: outstanding._sum.amount ?? 0,
          outstandingPendingCount: outstanding._count,
          monthlyRecurringRevenue: activeSubs.reduce((sum, s) => {
               const m = monthsInTerm(s.subscription.duration, s.subscription.durationUnit);
               return m > 0 ? sum + s.subscription.price / m : sum;
          }, 0),
          activeSubscribers: activeSubs.length,
          series,
          byStatus: (["paid", "pending", "failed", "partial", "other"] as TxGroup[])
               .map((g) => ({ group: g, label: STATUS_LABELS[g], ...(statusMap.get(g) ?? { count: 0, amount: 0 }) }))
               .filter((s) => s.count > 0),
          byPlan: [...planMap.entries()].map(([planId, v]) => ({ planId, name: planId ? planNames.get(planId) ?? "Deleted plan" : "Unknown plan", ...v })).sort((a, b) => b.amount - a.amount),
          byMethod: [...methodMap.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.amount - a.amount),
          topClients: [...clientMap.entries()].map(([clientId, v]) => ({ clientId, ...v })).sort((a, b) => b.amount - a.amount).slice(0, 8),
          bestBucket: best && best.revenue > 0 ? { label: best.label, revenue: best.revenue } : null,
     };
}

/** Database filter matching each txGroup — used by the transactions list so card links show exactly what was counted. */
export const TX_GROUP_WHERE: Record<Exclude<TxGroup, "other">, import("@prisma/client").Prisma.TransactionWhereInput> = {
     paid: REVENUE_TX_WHERE,
     pending: PENDING_TX_WHERE,
     partial: { transactionStatus: "PARTIALLY_PAID" },
     failed: {
          OR: [
               { transactionStatus: { in: ["FAILED", "EXPIRED", "CANCELLED"] } },
               { transactionStatus: "NONE", OR: ["rejected", "failed", "cancelled"].map((s) => ({ status: { equals: s, mode: "insensitive" as const } })) },
          ],
     },
};
