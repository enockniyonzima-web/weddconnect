import "server-only";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { Prisma } from "@prisma/client";
import { USD_TO_RWF_RATE } from "@/common/CommonTypes";
import { AdminClientSelect } from "@/app/dashboard/admin/clients/select-types";
import { ClientStatus, clientStatusWhere, REVENUE_TX_WHERE, EXPIRING_SOON_DAYS } from "./client-status";
import { ResolvedRange, rangeFilter, pickGranularity, buildBuckets, bucketKey, toKigaliDateStr, percentChange, Granularity } from "./date-range";

export const STATUS_ORDER: ClientStatus[] = ["active", "expiring", "pending", "expired", "inactive", "none"];

export async function fetchStatusCounts(now = new Date()) {
     const [all, ...counts] = await Promise.all([
          prisma.client.count(),
          ...STATUS_ORDER.map((s) => prisma.client.count({ where: clientStatusWhere(s, now) })),
     ]);
     return { all, ...Object.fromEntries(STATUS_ORDER.map((s, i) => [s, counts[i]])) } as Record<ClientStatus | "all", number>;
}

export const CLIENT_SORTS = [
     { value: "newest", label: "Newest sign-ups" },
     { value: "name", label: "Name (A–Z)" },
     { value: "expiry-soon", label: "Plan ends soonest" },
     { value: "expiry-late", label: "Plan ends latest" },
] as const;

export const DATE_FIELDS = [
     { value: "expiry", label: "Plan end date" },
     { value: "start", label: "Plan start date" },
     { value: "joined", label: "Sign-up date" },
] as const;

export async function fetchClientDirectory(opts: {
     status: ClientStatus | "all";
     search: Record<string, string | undefined>;
     range: ResolvedRange | null;
     page: number;
     size: number;
}) {
     await requireAdmin();
     const now = new Date();
     const { search, range } = opts;
     const and: Prisma.ClientWhereInput[] = [clientStatusWhere(opts.status, now)];

     const q = search.q?.trim();
     if (q) {
          const contains = { contains: q, mode: "insensitive" as const };
          const or: Prisma.ClientWhereInput[] = [{ name: contains }, { phone: contains }, { user: { email: contains } }];
          const asId = Number(q.replace(/^#/, ""));
          if (Number.isInteger(asId) && asId > 0 && asId < 2_147_483_647) or.push({ id: asId });
          and.push({ OR: or });
     }
     const planId = Number(search.plan);
     if (Number.isInteger(planId) && planId > 0) and.push({ subscription: { is: { subscriptionId: planId } } });

     if (range) {
          const f = rangeFilter(range);
          const field = search.dateField ?? (opts.status === "none" ? "joined" : "expiry");
          if (field === "start") and.push({ subscription: { is: { createdAt: f } } });
          else if (field === "joined") and.push({ user: { createdAt: f } });
          else and.push({ subscription: { is: { expiryAt: f } } });
     }

     const orderBy: Prisma.ClientOrderByWithRelationInput[] =
          search.sort === "name" ? [{ name: "asc" }]
          : search.sort === "expiry-soon" ? [{ subscription: { expiryAt: { sort: "asc", nulls: "last" } } }, { id: "desc" }]
          : search.sort === "expiry-late" ? [{ subscription: { expiryAt: { sort: "desc", nulls: "last" } } }, { id: "desc" }]
          : opts.status === "expiring" && !search.sort ? [{ subscription: { expiryAt: "asc" } }]
          : [{ id: "desc" }];

     const where: Prisma.ClientWhereInput = { AND: and };
     const [clients, total] = await Promise.all([
          prisma.client.findMany({ where, select: AdminClientSelect, orderBy, take: opts.size, skip: (opts.page - 1) * opts.size }),
          prisma.client.count({ where }),
     ]);

     const subIds = clients.map((c) => c.subscription?.id).filter((id): id is number => !!id);
     const paid = subIds.length
          ? await prisma.transaction.groupBy({ by: ["clientSubscriptionId"], where: { AND: [REVENUE_TX_WHERE, { clientSubscriptionId: { in: subIds } }] }, _sum: { amount: true }, _count: true, _max: { createdAt: true } })
          : [];
     const paidMap = Object.fromEntries(paid.map((p) => [p.clientSubscriptionId, { total: p._sum.amount ?? 0, count: p._count, last: p._max.createdAt }]));

     return {
          clients: clients.map((c) => ({ ...c, payments: c.subscription ? paidMap[c.subscription.id] ?? { total: 0, count: 0, last: null } : { total: 0, count: 0, last: null } })),
          total,
     };
}

export type TClientDirectoryRow = Awaited<ReturnType<typeof fetchClientDirectory>>["clients"][number];

export async function fetchPlanOptions() {
     return prisma.subscription.findMany({ select: { id: true, name: true }, orderBy: { price: "asc" } });
}

export interface ClientsOverview {
     counts: Record<ClientStatus | "all", number>;
     granularity: Granularity;
     newSubscriptions: number;
     newSubscriptionsChange?: number | null;
     newSignups: number;
     newSignupsChange?: number | null;
     endedInPeriod: number;
     revenue: number;
     renewals: number;
     series: { key: string; label: string; revenue: number; count: number }[];
     activeByPlan: { planId: number; name: string; count: number }[];
     upcoming: { id: number; name: string; phone: string; plan: string; expiryAt: Date }[];
}

export async function fetchClientsOverview(range: ResolvedRange): Promise<ClientsOverview> {
     await requireAdmin();
     const now = new Date();
     const created = rangeFilter(range);
     const prev = range.previous ? { gte: range.previous.from, lt: range.previous.to } : null;
     const in14 = new Date(now.getTime() + 14 * 86_400_000);
     const endedTo = range.to < now ? range.to : now;

     const [counts, newSubs, prevNewSubs, signups, prevSignups, ended, paidRows, activeGroups, upcoming] = await Promise.all([
          fetchStatusCounts(now),
          prisma.clientSubscription.findMany({ where: { createdAt: created }, select: { createdAt: true } }),
          prev ? prisma.clientSubscription.count({ where: { createdAt: prev } }) : Promise.resolve(null),
          prisma.client.count({ where: { user: { createdAt: created } } }),
          prev ? prisma.client.count({ where: { user: { createdAt: prev } } }) : Promise.resolve(null),
          prisma.client.count({ where: { AND: [clientStatusWhere("expired", now), { subscription: { is: { expiryAt: range.from ? { gte: range.from, lt: endedTo } : { lt: endedTo } } } }] } }),
          prisma.transaction.findMany({ where: { AND: [REVENUE_TX_WHERE, { createdAt: created }] }, select: { amount: true, clientSubscriptionId: true, createdAt: true, clientSubscription: { select: { createdAt: true } } } }),
          prisma.clientSubscription.groupBy({ by: ["subscriptionId"], where: { expiryAt: { gt: now } }, _count: true }),
          prisma.clientSubscription.findMany({
               where: { expiryAt: { gt: now, lte: in14 } },
               orderBy: { expiryAt: "asc" },
               take: 8,
               select: { expiryAt: true, client: { select: { id: true, name: true, phone: true } }, subscription: { select: { name: true } } },
          }),
     ]);

     const fromStr = range.fromStr ?? (newSubs.length ? toKigaliDateStr(newSubs.reduce((m, s) => (s.createdAt < m ? s.createdAt : m), newSubs[0].createdAt)) : range.toStr);
     const granularity = pickGranularity(fromStr, range.toStr);
     const buckets = new Map(buildBuckets(fromStr, range.toStr, granularity).map((b) => [b.key, { ...b, revenue: 0, count: 0 }]));
     for (const s of newSubs) {
          const b = buckets.get(bucketKey(s.createdAt, granularity));
          if (b) b.count += 1;
     }

     // A "renewal" is a successful payment made more than a day after that client's first subscription.
     const renewals = paidRows.filter((t) => t.createdAt.getTime() - t.clientSubscription.createdAt.getTime() > 86_400_000).length;

     const plans = await prisma.subscription.findMany({ where: { id: { in: activeGroups.map((g) => g.subscriptionId) } }, select: { id: true, name: true } });
     const planNames = new Map(plans.map((p) => [p.id, p.name]));

     return {
          counts,
          granularity,
          newSubscriptions: newSubs.length,
          newSubscriptionsChange: prevNewSubs === null ? undefined : percentChange(newSubs.length, prevNewSubs),
          newSignups: signups,
          newSignupsChange: prevSignups === null ? undefined : percentChange(signups, prevSignups),
          endedInPeriod: ended,
          revenue: paidRows.reduce((s, t) => s + t.amount, 0),
          renewals,
          series: [...buckets.values()],
          activeByPlan: activeGroups.map((g) => ({ planId: g.subscriptionId, name: planNames.get(g.subscriptionId) ?? "Deleted plan", count: g._count })).sort((a, b) => b.count - a.count),
          upcoming: upcoming.map((u) => ({ id: u.client.id, name: u.client.name, phone: u.client.phone, plan: u.subscription.name, expiryAt: u.expiryAt! })),
     };
}

export { EXPIRING_SOON_DAYS };

const toRwf = (p: { price: number; currency: string }) => (p.currency === "USD" ? Math.round(p.price * USD_TO_RWF_RATE) : p.price);

/** Per-plan numbers for the Plans page. Revenue is limited to the chosen period; subscriber counts are as of now. */
export async function fetchPlanStats(range: ResolvedRange) {
     await requireAdmin();
     const now = new Date();
     const [plans, revenueRows, subs] = await Promise.all([
          prisma.subscription.findMany({ orderBy: { price: "asc" }, select: { id: true, name: true, price: true, currency: true, duration: true, durationUnit: true, benefits: true, isActive: true, description: true } }),
          prisma.transaction.findMany({ where: { AND: [REVENUE_TX_WHERE, { createdAt: rangeFilter(range) }] }, select: { amount: true, subscriptionId: true, clientSubscription: { select: { subscriptionId: true } } } }),
          prisma.clientSubscription.findMany({
               select: { id: true, subscriptionId: true, createdAt: true, expiryAt: true, client: { select: { id: true, name: true, phone: true } } },
               orderBy: { expiryAt: { sort: "desc", nulls: "last" } },
          }),
     ]);
     const revenue = new Map<number, { amount: number; count: number }>();
     for (const t of revenueRows) {
          const id = t.subscriptionId ?? t.clientSubscription.subscriptionId;
          const r = revenue.get(id) ?? { amount: 0, count: 0 };
          r.amount += t.amount; r.count += 1;
          revenue.set(id, r);
     }
     return plans.map((p) => {
          const mine = subs.filter((s) => s.subscriptionId === p.id);
          const active = mine.filter((s) => s.expiryAt && s.expiryAt > now).length;
          const expired = mine.filter((s) => s.expiryAt && s.expiryAt <= now).length;
          return {
               ...p,
               priceRwf: toRwf(p),
               subscribers: mine.length,
               active,
               expired,
               notStarted: mine.length - active - expired,
               revenue: revenue.get(p.id)?.amount ?? 0,
               payments: revenue.get(p.id)?.count ?? 0,
               members: mine.slice(0, 100).map((s) => ({ id: s.client.id, name: s.client.name, phone: s.client.phone, since: s.createdAt, expiryAt: s.expiryAt })),
          };
     });
}
export type TPlanStats = Awaited<ReturnType<typeof fetchPlanStats>>[number];
