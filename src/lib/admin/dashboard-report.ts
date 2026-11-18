import "server-only";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { fetchFinanceReport } from "./finance-report";
import { fetchStatusCounts } from "./clients-report";
import { REVENUE_TX_WHERE } from "./client-status";
import { TX_GROUP_WHERE } from "./finance-report";
import { resolveRange, toKigaliDateStr, addDaysStr, kigaliDayStart } from "./date-range";

const insensitive = (values: string[]) => values.map((v) => ({ status: { equals: v, mode: "insensitive" as const } }));
/** Posts visible to the public: the public listing shows status exactly "published". */
const LIVE_POST = { status: "published" };
const PENDING_POST = { OR: insensitive(["pending"]) };

export async function fetchDashboardReport() {
     await requireAdmin();
     const now = new Date();
     const today = toKigaliDateStr(now);

     // Fixed windows (no date picker on the dashboard): this month, and the last 12 months for the trend.
     const thisMonth = resolveRange({ range: "month" }, "month", now);
     const elevenMonthsBack = new Date(Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1 - 11, 1)).toISOString().slice(0, 10);
     const twelveMonths = resolveRange({ from: elevenMonthsBack, to: today }, "all", now);
     const weekAgo = kigaliDayStart(addDaysStr(today, -6));

     const [
          month, year, counts,
          vendorTotal, vendorActive, postTotal, postLive, postPending,
          reviewAgg, likes, blogPublished, blogViews, blogDrafts,
          failedThisWeek, categories, topPosts,
          recentPayments, recentSignups, recentReviews,
     ] = await Promise.all([
          fetchFinanceReport(thisMonth),
          fetchFinanceReport(twelveMonths),
          fetchStatusCounts(now),
          prisma.vendor.count(),
          prisma.vendor.count({ where: { status: true } }),
          prisma.post.count(),
          prisma.post.count({ where: LIVE_POST }),
          prisma.post.count({ where: PENDING_POST }),
          prisma.postReview.aggregate({ _avg: { rating: true }, _count: true }),
          prisma.postLike.count(),
          prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
          prisma.blogPost.aggregate({ _sum: { viewsCount: true }, where: { status: "PUBLISHED" } }),
          prisma.blogPost.count({ where: { status: "DRAFT" } }),
          prisma.transaction.count({ where: { AND: [TX_GROUP_WHERE.failed, { createdAt: { gte: weekAgo } }] } }),
          prisma.category.findMany({ select: { id: true, name: true, _count: { select: { posts: true } } }, orderBy: { rank: "asc" } }),
          prisma.post.findMany({
               where: LIVE_POST,
               select: { id: true, title: true, vendor: { select: { name: true } }, _count: { select: { likes: true, reviews: true } } },
               orderBy: [{ likes: { _count: "desc" } }, { reviews: { _count: "desc" } }],
               take: 5,
          }),
          prisma.transaction.findMany({ where: REVENUE_TX_WHERE, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, amount: true, createdAt: true, clientSubscription: { select: { client: { select: { name: true } } } } } }),
          prisma.client.findMany({ orderBy: { user: { createdAt: "desc" } }, take: 5, select: { id: true, name: true, user: { select: { createdAt: true } } } }),
          prisma.postReview.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, rating: true, createdAt: true, post: { select: { title: true } }, client: { select: { name: true } } } }),
     ]);

     const activity = [
          ...recentPayments.map((t) => ({ kind: "payment" as const, id: `p${t.id}`, at: t.createdAt, title: `${t.clientSubscription.client.name} paid`, detail: t.amount, href: `/dashboard/admin/finance/transactions?q=${t.id}` })),
          ...recentSignups.map((c) => ({ kind: "signup" as const, id: `c${c.id}`, at: c.user.createdAt, title: `${c.name} signed up`, detail: null, href: `/dashboard/admin/clients/all?q=${c.id}` })),
          ...recentReviews.map((r) => ({ kind: "review" as const, id: `r${r.id}`, at: r.createdAt, title: `${r.client?.name ?? "A visitor"} reviewed “${r.post.title}”`, detail: r.rating, href: "/dashboard/admin/posts" })),
     ].sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 8);

     return {
          month, year, counts,
          vendors: { total: vendorTotal, active: vendorActive },
          posts: { total: postTotal, live: postLive, pending: postPending },
          reviews: { count: reviewAgg._count, avg: reviewAgg._avg.rating },
          likes,
          blog: { published: blogPublished, views: blogViews._sum.viewsCount ?? 0, drafts: blogDrafts },
          failedThisWeek,
          categories: categories.map((c) => ({ id: c.id, name: c.name, posts: c._count.posts })).sort((a, b) => b.posts - a.posts),
          topPosts: topPosts.map((p) => ({ id: p.id, title: p.title, vendor: p.vendor.name, likes: p._count.likes, reviews: p._count.reviews })),
          activity,
     };
}
