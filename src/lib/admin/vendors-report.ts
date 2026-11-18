import "server-only";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { Prisma } from "@prisma/client";

/** The public site lists posts whose status is exactly "published" (see CategoryPostContainer). */
export const LIVE_POST_STATUS = "published";
const isLive = (s: string) => s === LIVE_POST_STATUS;
const isPending = (s: string) => s.toLowerCase() === "pending";

const pendingWhere: Prisma.PostWhereInput = { status: { equals: "pending", mode: "insensitive" } };
const liveWhere: Prisma.PostWhereInput = { status: LIVE_POST_STATUS };

export const VENDOR_SETUP_FILTERS = [
     { value: "live", label: "Has live posts" },
     { value: "pending", label: "Has posts to approve" },
     { value: "no-posts", label: "No posts yet" },
     { value: "no-contacts", label: "Missing contact details" },
] as const;

export const VENDOR_SORTS = [
     { value: "name", label: "Name (A–Z)" },
     { value: "posts", label: "Most posts" },
] as const;

function setupWhere(v?: string): Prisma.VendorWhereInput {
     switch (v) {
          case "live": return { posts: { some: liveWhere } };
          case "pending": return { posts: { some: pendingWhere } };
          case "no-posts": return { posts: { none: {} } };
          case "no-contacts": return { contacts: { none: {} } };
          default: return {};
     }
}

export async function fetchVendorCounts() {
     const [total, active, withLive, noPosts, noContacts, pendingPosts] = await Promise.all([
          prisma.vendor.count(),
          prisma.vendor.count({ where: { status: true } }),
          prisma.vendor.count({ where: setupWhere("live") }),
          prisma.vendor.count({ where: setupWhere("no-posts") }),
          prisma.vendor.count({ where: setupWhere("no-contacts") }),
          prisma.post.count({ where: pendingWhere }),
     ]);
     return { total, active, inactive: total - active, withLive, noPosts, noContacts, pendingPosts };
}

export async function fetchVendorDirectory(search: Record<string, string | undefined>, page: number, size: number) {
     await requireAdmin();
     const and: Prisma.VendorWhereInput[] = [setupWhere(search.setup)];
     if (search.status === "active") and.push({ status: true });
     if (search.status === "inactive") and.push({ status: false });
     const categoryId = Number(search.category);
     if (Number.isInteger(categoryId) && categoryId > 0) and.push({ posts: { some: { categoryId } } });

     const q = search.q?.trim();
     if (q) {
          const contains = { contains: q, mode: "insensitive" as const };
          and.push({ OR: [{ name: contains }, { user: { email: contains } }, { contacts: { some: { value: contains } } }, { posts: { some: { title: contains } } }] });
     }

     const where: Prisma.VendorWhereInput = { AND: and };
     const orderBy: Prisma.VendorOrderByWithRelationInput[] = search.sort === "name" ? [{ name: "asc" }] : search.sort === "posts" ? [{ posts: { _count: "desc" } }, { name: "asc" }] : [{ id: "desc" }];

     const [vendors, total] = await Promise.all([
          prisma.vendor.findMany({
               where, orderBy, take: size, skip: (page - 1) * size,
               select: {
                    id: true, name: true, status: true,
                    user: { select: { email: true, image: true, createdAt: true } },
                    contacts: { select: { id: true, value: true, contactType: { select: { name: true, type: true } } } },
                    posts: {
                         orderBy: { createdAt: "desc" },
                         select: { id: true, title: true, status: true, createdAt: true, location: true, category: { select: { name: true } }, _count: { select: { likes: true, reviews: true } } },
                    },
               },
          }),
          prisma.vendor.count({ where }),
     ]);

     const postIds = vendors.flatMap((v) => v.posts.map((p) => p.id));
     const ratings = postIds.length ? await prisma.postReview.groupBy({ by: ["postId"], where: { postId: { in: postIds } }, _sum: { rating: true }, _count: true }) : [];
     const ratingMap = new Map(ratings.map((r) => [r.postId, r]));

     return {
          total,
          vendors: vendors.map((v) => {
               let ratingSum = 0, reviewCount = 0;
               for (const p of v.posts) {
                    const r = ratingMap.get(p.id);
                    if (r) { ratingSum += r._sum.rating ?? 0; reviewCount += r._count; }
               }
               return {
                    ...v,
                    stats: {
                         posts: v.posts.length,
                         live: v.posts.filter((p) => isLive(p.status)).length,
                         pending: v.posts.filter((p) => isPending(p.status)).length,
                         likes: v.posts.reduce((s, p) => s + p._count.likes, 0),
                         reviews: reviewCount,
                         // Weighted by number of reviews, not an average of post averages.
                         rating: reviewCount ? ratingSum / reviewCount : null,
                    },
               };
          }),
     };
}
export type TVendorRow = Awaited<ReturnType<typeof fetchVendorDirectory>>["vendors"][number];

export const fetchCategoryOptions = () => prisma.category.findMany({ select: { id: true, name: true }, orderBy: { rank: "asc" } });
