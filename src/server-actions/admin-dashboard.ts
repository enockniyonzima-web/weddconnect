"use server";

import { IAdminStats, IRecentActivity, IPopularPostsResponse } from "@/common/interfaces";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Use Next.js unstable_cache for robust server-side caching
// This cache persists across requests and can be revalidated
export const fetchAdminStats = unstable_cache(
     async (): Promise<IAdminStats | null> => {
          try {
               // Calculate date 30 days ago for recent activity
               const thirtyDaysAgo = new Date();
               thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

               // Execute all queries in parallel using Promise.all for better performance
               const [
                    // User Statistics
                    totalUsers,
                    totalClients,
                    totalVendors,
                    totalAdmins,
                    activeUsers,
                    
                    // Post Statistics
                    totalPosts,
                    activePosts,
                    pendingPosts,
                    postsByCategory,
                    
                    // Financial Metrics
                    totalTransactions,
                    pendingTransactions,
                    verifiedTransactions,
                    revenueData,
                    
                    // Subscription Statistics
                    totalSubscriptions,
                    activeSubscriptions,
                    subscriptionsByType,
                    
                    // Engagement Metrics
                    totalReviews,
                    totalLikes,
                    
                    // Recent Activity
                    recentTransactions,
                    recentPosts,
                    recentClients,
               ] = await Promise.all([
                    // User Statistics
                    prisma.user.count(),
                    prisma.client.count(),
                    prisma.vendor.count(),
                    prisma.admin.count(),
                    prisma.user.count({ where: { status: true } }),
                    
                    // Post Statistics
                    prisma.post.count(),
                    prisma.post.count({ where: { status: 'active' } }),
                    prisma.post.count({ where: { status: 'pending' } }),
                    prisma.post.groupBy({
                         by: ['categoryId'],
                         _count: { id: true },
                    }),
                    
                    // Financial Metrics
                    prisma.transaction.count(),
                    prisma.transaction.count({ where: { status: 'pending' } }),
                    prisma.transaction.count({ where: { status: 'verified' } }),
                    prisma.transaction.aggregate({
                         _sum: { amount: true },
                         _avg: { amount: true },
                    }),
                    
                    // Subscription Statistics
                    prisma.clientSubscription.count(),
                    prisma.clientSubscription.count({
                         where: { expiryAt: { gte: new Date() } },
                    }),
                    prisma.clientSubscription.groupBy({
                         by: ['subscriptionId'],
                         _count: { id: true },
                    }),
                    
                    // Engagement Metrics
                    prisma.postReview.count(),
                    prisma.postLike.count(),
                    
                    // Recent Activity (Last 30 days)
                    prisma.transaction.count({
                         where: { createdAt: { gte: thirtyDaysAgo } },
                    }),
                    prisma.post.count({
                         where: { createdAt: { gte: thirtyDaysAgo } },
                    }),
                    prisma.client.count({
                         where: { user: { createdAt: { gte: thirtyDaysAgo } } },
                    }),
               ]);

               // Fetch category names for posts by category
               const categoryIds = postsByCategory.map((p) => p.categoryId);
               const categories = await prisma.category.findMany({
                    where: { id: { in: categoryIds } },
                    select: { id: true, name: true },
               });

               const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

               // Fetch subscription names
               const subscriptionIds = subscriptionsByType.map((s) => s.subscriptionId);
               const subscriptions = await prisma.subscription.findMany({
                    where: { id: { in: subscriptionIds } },
                    select: { id: true, name: true },
               });

               const subscriptionMap = new Map(subscriptions.map((s) => [s.id, s.name]));

               // Build the stats object
               const stats: IAdminStats = {
                    // User Statistics
                    totalUsers,
                    totalClients,
                    totalVendors,
                    totalAdmins,
                    activeUsers,
                    
                    // Post Statistics
                    totalPosts,
                    activePosts,
                    pendingPosts,
                    postsByCategory: postsByCategory.map((p) => ({
                         categoryName: categoryMap.get(p.categoryId) || 'Unknown',
                         count: p._count.id,
                    })),
                    
                    // Financial Metrics
                    totalRevenue: revenueData._sum.amount || 0,
                    totalTransactions,
                    pendingTransactions,
                    verifiedTransactions,
                    averageTransactionValue: revenueData._avg.amount || 0,
                    
                    // Subscription Statistics
                    totalSubscriptions,
                    activeSubscriptions,
                    subscriptionsByType: subscriptionsByType.map((s) => ({
                         subscriptionName: subscriptionMap.get(s.subscriptionId) || 'Unknown',
                         count: s._count.id,
                    })),
                    
                    // Engagement Metrics
                    totalReviews,
                    totalLikes,
                    averagePostRating: 0, // This would require calculating from review content/ratings
                    
                    // Recent Activity
                    recentTransactions,
                    recentPosts,
                    recentClients,
               };

               return stats;
          } catch (err) {
               console.error("Error fetching admin stats:", err);
               return null;
          }
     },
     ['admin-stats'], // Cache key
     {
          revalidate: 300, // Revalidate cache every 5 minutes (300 seconds)
          tags: ['admin-stats'], // Tags for on-demand revalidation
     }
);

// Helper function to manually revalidate admin stats cache
export async function revalidateAdminStats() {
     "use server";
     try {
          const { revalidateTag } = await import('next/cache');
          // @ts-expect-error - Next.js revalidateTag signature varies by version
          revalidateTag('admin-stats');
     } catch (error) {
          console.error('Error revalidating admin stats:', error);
     }
}

// Fetch recent activities across the platform
export const fetchRecentActivities = unstable_cache(
     async (limit: number = 10): Promise<IRecentActivity | null> => {
          try {
               const [transactions, posts, clients, reviews, vendors] = await Promise.all([
                    // Recent Transactions
                    prisma.transaction.findMany({
                         take: limit,
                         orderBy: { createdAt: 'desc' },
                         include: {
                              clientSubscription: {
                                   include: {
                                        client: {
                                             include: {
                                                  user: { select: { email: true } }
                                             }
                                        },
                                        subscription: { select: { name: true } }
                                   }
                              }
                         }
                    }),
                    
                    // Recent Posts
                    prisma.post.findMany({
                         take: limit,
                         orderBy: { createdAt: 'desc' },
                         include: {
                              vendor: { select: { name: true } },
                              category: { select: { name: true } },
                              images: { take: 1, select: { url: true } }
                         }
                    }),
                    
                    // Recent Clients
                    prisma.client.findMany({
                         take: limit,
                         orderBy: { user: { createdAt: 'desc' } },
                         include: {
                              user: { select: { email: true, createdAt: true } },
                              subscription: { select: { id: true } }
                         }
                    }),
                    
                    // Recent Reviews
                    prisma.postReview.findMany({
                         take: limit,
                         orderBy: { createdAt: 'desc' },
                         include: {
                              client: { select: { name: true } },
                              post: { select: { title: true } }
                         }
                    }),
                    
                    // Recent Vendors
                    prisma.vendor.findMany({
                         take: limit,
                         orderBy: { user: { createdAt: 'desc' } },
                         include: {
                              user: { select: { email: true, createdAt: true } },
                              _count: { select: { posts: true } }
                         }
                    })
               ]);

               const recentActivity: IRecentActivity = {
                    transactions: transactions.map(t => ({
                         id: t.id,
                         amount: t.amount,
                         status: t.status,
                         transactionMethod: t.transactionMethod,
                         createdAt: t.createdAt,
                         clientName: t.clientSubscription.client.name,
                         subscriptionName: t.clientSubscription.subscription.name
                    })),
                    
                    posts: posts.map(p => ({
                         id: p.id,
                         title: p.title,
                         status: p.status,
                         createdAt: p.createdAt,
                         vendorName: p.vendor.name,
                         categoryName: p.category.name,
                         imageUrl: p.images[0]?.url
                    })),
                    
                    clients: clients.map(c => ({
                         id: c.id,
                         name: c.name,
                         email: c.user.email,
                         phone: c.phone,
                         createdAt: c.user.createdAt,
                         hasSubscription: !!c.subscription
                    })),
                    
                    reviews: reviews.map(r => ({
                         id: r.id,
                         content: r.content,
                         type: r.type,
                         createdAt: r.createdAt,
                         clientName: r.client.name,
                         postTitle: r.post.title
                    })),
                    
                    vendors: vendors.map(v => ({
                         id: v.id,
                         name: v.name,
                         email: v.user.email,
                         status: v.status,
                         createdAt: v.user.createdAt,
                         totalPosts: v._count.posts
                    }))
               };

               return recentActivity;
          } catch (err) {
               console.error("Error fetching recent activities:", err);
               return null;
          }
     },
     ['recent-activities'],
     {
          revalidate: 60, // Revalidate every 1 minute for fresh data
          tags: ['recent-activities']
     }
);

// Fetch popular posts based on engagement metrics
export const fetchPopularPosts = unstable_cache(
     async (
          limit: number = 20,
          categoryId?: number,
          location?: string
     ): Promise<IPopularPostsResponse | null> => {
          try {
               // Build where clause
               interface WhereClause {
                    status: string;
                    categoryId?: number;
                    location?: string;
               }
               
               const where: WhereClause = {
                    status: 'active' // Only show active posts
               };
               
               if (categoryId) {
                    where.categoryId = categoryId;
               }
               
               if (location) {
                    where.location = location;
               }

               // Fetch posts with engagement metrics
               const posts = await prisma.post.findMany({
                    where,
                    include: {
                         category: { select: { name: true } },
                         vendor: { select: { name: true } },
                         images: { take: 1, select: { url: true } },
                         price: { select: { min: true, max: true, currency: true } },
                         _count: {
                              select: {
                                   likes: true,
                                   reviews: true
                              }
                         }
                    },
                    take: limit * 2 // Fetch more to calculate popularity score
               });

               // Calculate popularity score for each post
               const postsWithScore = posts.map(post => {
                    // Popularity algorithm:
                    // - Each like: 1 point
                    // - Each review: 3 points (reviews are more valuable)
                    // - Recency bonus: posts created in last 30 days get 20% boost
                    const likesScore = post._count.likes * 1;
                    const reviewsScore = post._count.reviews * 3;
                    
                    const daysSinceCreation = Math.floor(
                         (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const recencyBonus = daysSinceCreation <= 30 ? 1.2 : 1;
                    
                    const popularityScore = (likesScore + reviewsScore) * recencyBonus;

                    return {
                         id: post.id,
                         title: post.title,
                         description: post.description,
                         categoryName: post.category.name,
                         vendorName: post.vendor.name,
                         location: post.location,
                         imageUrl: post.images[0]?.url,
                         likesCount: post._count.likes,
                         reviewsCount: post._count.reviews,
                         averageRating: 0, // Would need to calculate from review content if ratings exist
                         popularityScore,
                         minPrice: post.price?.min,
                         maxPrice: post.price?.max,
                         currency: post.price?.currency,
                         createdAt: post.createdAt
                    };
               });

               // Sort by popularity score and take top posts
               const sortedPosts = postsWithScore
                    .sort((a, b) => b.popularityScore - a.popularityScore)
                    .slice(0, limit);

               return {
                    posts: sortedPosts,
                    totalCount: posts.length
               };
          } catch (err) {
               console.error("Error fetching popular posts:", err);
               return null;
          }
     },
     ['popular-posts'],
     {
          revalidate: 300, // Revalidate every 5 minutes
          tags: ['popular-posts']
     }
);

// Fetch trending posts (popular in the last 7 days)
export const fetchTrendingPosts = unstable_cache(
     async (limit: number = 10): Promise<IPopularPostsResponse | null> => {
          try {
               const sevenDaysAgo = new Date();
               sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

               // Get posts with recent engagement
               const posts = await prisma.post.findMany({
                    where: {
                         status: 'active',
                         OR: [
                              { likes: { some: { createdAt: { gte: sevenDaysAgo } } } },
                              { reviews: { some: { createdAt: { gte: sevenDaysAgo } } } },
                              { createdAt: { gte: sevenDaysAgo } }
                         ]
                    },
                    include: {
                         category: { select: { name: true } },
                         vendor: { select: { name: true } },
                         images: { take: 1, select: { url: true } },
                         price: { select: { min: true, max: true, currency: true } },
                         _count: {
                              select: {
                                   likes: true,
                                   reviews: true
                              }
                         },
                         likes: {
                              where: { createdAt: { gte: sevenDaysAgo } },
                              select: { id: true }
                         },
                         reviews: {
                              where: { createdAt: { gte: sevenDaysAgo } },
                              select: { id: true }
                         }
                    }
               });

               // Calculate trending score based on recent activity
               const postsWithScore = posts.map(post => {
                    const recentLikes = post.likes.length;
                    const recentReviews = post.reviews.length;
                    
                    // Trending score: recent activity weighted heavily
                    const trendingScore = (recentLikes * 2) + (recentReviews * 5);

                    return {
                         id: post.id,
                         title: post.title,
                         description: post.description,
                         categoryName: post.category.name,
                         vendorName: post.vendor.name,
                         location: post.location,
                         imageUrl: post.images[0]?.url,
                         likesCount: post._count.likes,
                         reviewsCount: post._count.reviews,
                         averageRating: 0,
                         popularityScore: trendingScore,
                         minPrice: post.price?.min,
                         maxPrice: post.price?.max,
                         currency: post.price?.currency,
                         createdAt: post.createdAt
                    };
               });

               // Sort by trending score
               const sortedPosts = postsWithScore
                    .sort((a, b) => b.popularityScore - a.popularityScore)
                    .slice(0, limit);

               return {
                    posts: sortedPosts,
                    totalCount: posts.length
               };
          } catch (err) {
               console.error("Error fetching trending posts:", err);
               return null;
          }
     },
     ['trending-posts'],
     {
          revalidate: 180, // Revalidate every 3 minutes for trending data
          tags: ['trending-posts']
     }
);

// Helper functions to revalidate caches
export async function revalidateRecentActivities() {
     "use server";
     try {
          const { revalidateTag } = await import('next/cache');
          // @ts-expect-error - Next.js revalidateTag signature varies by version
          revalidateTag('recent-activities');
     } catch (error) {
          console.error('Error revalidating recent activities:', error);
     }
}

export async function revalidatePopularPosts() {
     "use server";
     try {
          const { revalidateTag } = await import('next/cache');
          // @ts-expect-error - Next.js revalidateTag signature varies by version
          revalidateTag('popular-posts');
          // @ts-expect-error - Next.js revalidateTag signature varies by version
          revalidateTag('trending-posts');
     } catch (error) {
          console.error('Error revalidating popular posts:', error);
     }
}