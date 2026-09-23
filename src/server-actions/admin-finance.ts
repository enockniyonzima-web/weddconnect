"use server";

import { IFinanceStats } from "@/common/interfaces";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek, startOfYear, subMonths } from "date-fns";

const PAID = { transactionStatus: "PAID" as const };

export const fetchFinanceStats = unstable_cache(
     async (): Promise<IFinanceStats | null> => {
          try {
               const now = new Date();

               const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
               const lastWeekAnchor = new Date(startOfThisWeek);
               lastWeekAnchor.setDate(lastWeekAnchor.getDate() - 7);
               const startOfLastWeek = startOfWeek(lastWeekAnchor, { weekStartsOn: 1 });
               const endOfLastWeek = endOfWeek(lastWeekAnchor, { weekStartsOn: 1 });

               const startOfThisMonth = startOfMonth(now);
               const startOfLastMonth = startOfMonth(subMonths(now, 1));
               const endOfLastMonth = endOfMonth(subMonths(now, 1));

               const startOfThisYear = startOfYear(now);
               const twelveMonthsAgo = startOfMonth(subMonths(now, 11));

               const [
                    totalPaidAgg,
                    avgPaidAgg,
                    pendingAgg,
                    partiallyPaidAgg,
                    failedOrExpiredCount,
                    thisWeekAgg,
                    lastWeekAgg,
                    thisMonthAgg,
                    lastMonthAgg,
                    thisYearAgg,
                    revenueByProviderRaw,
                    trendRows,
                    planRevenueRows,
                    topClientsRaw,
                    activeSubscriptions,
               ] = await Promise.all([
                    prisma.transaction.aggregate({ _sum: { amount: true }, _count: true, where: PAID }),
                    prisma.transaction.aggregate({ _avg: { amount: true }, where: PAID }),
                    prisma.transaction.aggregate({ _sum: { amount: true }, _count: true, where: { transactionStatus: "PENDING" } }),
                    prisma.transaction.aggregate({ _sum: { amount: true }, _count: true, where: { transactionStatus: "PARTIALLY_PAID" } }),
                    prisma.transaction.count({ where: { transactionStatus: { in: ["FAILED", "EXPIRED"] } } }),
                    prisma.transaction.aggregate({ _sum: { amount: true }, where: { ...PAID, createdAt: { gte: startOfThisWeek } } }),
                    prisma.transaction.aggregate({ _sum: { amount: true }, where: { ...PAID, createdAt: { gte: startOfLastWeek, lte: endOfLastWeek } } }),
                    prisma.transaction.aggregate({ _sum: { amount: true }, where: { ...PAID, createdAt: { gte: startOfThisMonth } } }),
                    prisma.transaction.aggregate({ _sum: { amount: true }, where: { ...PAID, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
                    prisma.transaction.aggregate({ _sum: { amount: true }, where: { ...PAID, createdAt: { gte: startOfThisYear } } }),
                    prisma.transaction.groupBy({ by: ["provider"], _sum: { amount: true }, _count: true, where: PAID }),
                    prisma.transaction.findMany({ where: { ...PAID, createdAt: { gte: twelveMonthsAgo } }, select: { amount: true, createdAt: true } }),
                    prisma.transaction.findMany({ where: PAID, select: { amount: true, clientSubscription: { select: { subscriptionId: true } } } }),
                    prisma.transaction.groupBy({ by: ["clientSubscriptionId"], _sum: { amount: true }, _count: true, where: PAID, orderBy: { _sum: { amount: "desc" } }, take: 10 }),
                    prisma.clientSubscription.findMany({
                         where: { expiryAt: { gte: now } },
                         select: { subscription: { select: { price: true, duration: true, durationUnit: true } } },
                    }),
               ]);

               // Revenue by plan — groupBy can't traverse the relation, so bucket in JS
               const planIds = [...new Set(planRevenueRows.map((r) => r.clientSubscription.subscriptionId))];
               const plans = await prisma.subscription.findMany({ where: { id: { in: planIds } }, select: { id: true, name: true } });
               const planMap = new Map(plans.map((p) => [p.id, p.name]));
               const planRevenueMap = new Map<string, { amount: number; count: number }>();
               for (const row of planRevenueRows) {
                    const name = planMap.get(row.clientSubscription.subscriptionId) || "Unknown";
                    const entry = planRevenueMap.get(name) || { amount: 0, count: 0 };
                    entry.amount += row.amount;
                    entry.count += 1;
                    planRevenueMap.set(name, entry);
               }
               const revenueByPlan = Array.from(planRevenueMap.entries()).map(([subscriptionName, v]) => ({ subscriptionName, ...v }));

               const revenueByProvider = revenueByProviderRaw.map((r) => ({
                    provider: r.provider,
                    amount: r._sum.amount || 0,
                    count: r._count,
               }));

               // 12-month trend, bucketed in JS (same style as fetchClientStats' subscriptionTrends)
               const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
               const monthlyRevenueTrend: IFinanceStats["monthlyRevenueTrend"] = [];
               for (let i = 11; i >= 0; i--) {
                    const monthStart = startOfMonth(subMonths(now, i));
                    const monthEnd = endOfMonth(subMonths(now, i));
                    const monthLabel = `${monthNames[monthStart.getMonth()]} ${monthStart.getFullYear()}`;
                    const amount = trendRows
                         .filter((t) => t.createdAt >= monthStart && t.createdAt <= monthEnd)
                         .reduce((sum, t) => sum + t.amount, 0);
                    monthlyRevenueTrend.push({ month: monthLabel, amount });
               }

               // Top paying clients — resolve names for the top clientSubscriptionIds
               const topSubIds = topClientsRaw.map((t) => t.clientSubscriptionId);
               const topSubs = await prisma.clientSubscription.findMany({
                    where: { id: { in: topSubIds } },
                    select: { id: true, client: { select: { name: true, phone: true } }, subscription: { select: { name: true } } },
               });
               const topSubMap = new Map(topSubs.map((s) => [s.id, s]));
               const topPayingClients = topClientsRaw.map((t) => {
                    const sub = topSubMap.get(t.clientSubscriptionId);
                    return {
                         clientId: t.clientSubscriptionId,
                         name: sub?.client.name || "Unknown",
                         phone: sub?.client.phone || "",
                         amount: t._sum.amount || 0,
                         subscriptionName: sub?.subscription.name || "Unknown",
                    };
               });

               // MRR — normalize duration to a monthly rate instead of trusting a hardcoded plan name
               const monthlyRecurringRevenue = activeSubscriptions.reduce((sum, s) => {
                    const { price, duration, durationUnit } = s.subscription;
                    if (!duration) return sum;
                    const monthsInTerm = durationUnit.toLowerCase().startsWith("year") ? duration * 12 : durationUnit.toLowerCase().startsWith("week") ? duration / 4.345 : duration;
                    return monthsInTerm > 0 ? sum + price / monthsInTerm : sum;
               }, 0);

               const revenueThisWeek = thisWeekAgg._sum.amount || 0;
               const revenueLastWeek = lastWeekAgg._sum.amount || 0;
               const revenueThisMonth = thisMonthAgg._sum.amount || 0;
               const revenueLastMonth = lastMonthAgg._sum.amount || 0;

               const stats: IFinanceStats = {
                    totalRevenue: totalPaidAgg._sum.amount || 0,
                    totalPaidTransactions: totalPaidAgg._count,
                    averageTransactionValue: avgPaidAgg._avg.amount || 0,

                    pendingAmount: pendingAgg._sum.amount || 0,
                    pendingCount: pendingAgg._count,
                    partiallyPaidAmount: partiallyPaidAgg._sum.amount || 0,
                    partiallyPaidCount: partiallyPaidAgg._count,
                    failedOrExpiredCount,

                    revenueThisWeek,
                    revenueLastWeek,
                    weekOverWeekGrowth: revenueLastWeek > 0 ? ((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100 : 0,

                    revenueThisMonth,
                    revenueLastMonth,
                    monthOverMonthGrowth: revenueLastMonth > 0 ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 : 0,

                    revenueThisYear: thisYearAgg._sum.amount || 0,

                    monthlyRecurringRevenue,
                    revenueByProvider,
                    revenueByPlan,
                    monthlyRevenueTrend,
                    topPayingClients,
               };

               return stats;
          } catch (err) {
               console.error("Error fetching finance stats:", err);
               return null;
          }
     },
     ["finance-stats"],
     {
          revalidate: 300,
          tags: ["finance-stats"],
     }
);

export async function revalidateFinanceStats() {
     "use server";
     try {
          const { revalidateTag } = await import("next/cache");
          // @ts-expect-error - Next.js revalidateTag signature varies by version
          revalidateTag("finance-stats");
     } catch (error) {
          console.error("Error revalidating finance stats:", error);
     }
}
