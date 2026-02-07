"use server";

import { IAdminStats, IRecentActivity, IPopularPostsResponse, IClientStats } from "@/common/interfaces";
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

// Fetch comprehensive client statistics
export const fetchClientStats = unstable_cache(
     async (): Promise<IClientStats | null> => {
          try {
               const now = new Date();
               const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
               const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
               const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
               const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

               // Execute all queries in parallel
               const [
                    totalClients,
                    clientsWithActiveSubscriptions,
                    clientsWithExpiredSubscriptions,
                    clientsWithPendingSubscriptions,
                    newClientsThisMonth,
                    newClientsLastMonth,
                    subscriptionDistribution,
                    allClientSubscriptions,
                    clientsWithReviews,
                    clientsWithLikes,
                    recentSignups,
                    recentSubscriptions,
                    recentTransactions,
                    topClientsData,
                    last6MonthsData,
               ] = await Promise.all([
                    // Total clients
                    prisma.client.count(),
                    
                    // Clients with active subscriptions
                    prisma.client.count({
                         where: {
                              subscription: {
                                   expiryAt: { gte: now }
                              }
                         }
                    }),
                    
                    // Clients with expired subscriptions
                    prisma.client.count({
                         where: {
                              subscription: {
                                   expiryAt: { lt: now, not: null }
                              }
                         }
                    }),
                    
                    // Clients with pending subscriptions (no expiry date set but has subscription)
                    prisma.client.count({
                         where: {
                              subscription: {
                                   expiryAt: null
                              }
                         }
                    }),
                    
                    // New clients this month
                    prisma.client.count({
                         where: {
                              user: {
                                   createdAt: { gte: startOfThisMonth }
                              }
                         }
                    }),
                    
                    // New clients last month
                    prisma.client.count({
                         where: {
                              user: {
                                   createdAt: {
                                        gte: startOfLastMonth,
                                        lte: endOfLastMonth
                                   }
                              }
                         }
                    }),
                    
                    // Subscription distribution
                    prisma.clientSubscription.groupBy({
                         by: ['subscriptionId'],
                         _count: { id: true }
                    }),
                    
                    // All client subscriptions for revenue calculation
                    prisma.clientSubscription.findMany({
                         include: {
                              subscription: { select: { name: true, price: true } },
                              transactions: {
                                   where: { status: { in: ['Approved', 'verified'] } },
                                   select: { amount: true }
                              }
                         }
                    }),
                    
                    // Clients with reviews (via PostReview)
                    prisma.postReview.groupBy({
                         by: ['clientId'],
                         _count: { id: true }
                    }).then(results => results.length),
                    
                    // Clients with likes (via PostLike)
                    prisma.postLike.groupBy({
                         by: ['clientId'],
                         _count: { id: true }
                    }).then(results => results.length),
                    
                    // Recent signups (last 7 days)
                    prisma.client.count({
                         where: {
                              user: { createdAt: { gte: sevenDaysAgo } }
                         }
                    }),
                    
                    // Recent subscriptions (last 7 days)
                    prisma.clientSubscription.count({
                         where: { createdAt: { gte: sevenDaysAgo } }
                    }),
                    
                    // Recent transactions (last 7 days)
                    prisma.transaction.count({
                         where: { createdAt: { gte: sevenDaysAgo } }
                    }),
                    
                    // Top 10 clients by spending
                    prisma.client.findMany({
                         include: {
                              subscription: {
                                   include: {
                                        subscription: { select: { name: true } },
                                        transactions: {
                                             where: { status: { in: ['Approved', 'verified'] } },
                                             select: { amount: true }
                                        }
                                   }
                              },
                              user: { select: { email: true } }
                         }
                    }),
                    
                    // Last 6 months subscription data
                    prisma.clientSubscription.findMany({
                         where: {
                              createdAt: {
                                   gte: new Date(now.getFullYear(), now.getMonth() - 6, 1)
                              }
                         },
                         select: {
                              createdAt: true,
                              expiryAt: true,
                              transactions: {
                                   select: {
                                        status: true,
                                        createdAt: true
                                   }
                              }
                         }
                    })
               ]);

               // Calculate derived metrics
               const clientsWithoutSubscriptions = totalClients - (clientsWithActiveSubscriptions + clientsWithExpiredSubscriptions + clientsWithPendingSubscriptions);
               const growthRate = newClientsLastMonth > 0 
                    ? ((newClientsThisMonth - newClientsLastMonth) / newClientsLastMonth) * 100 
                    : 0;

               // Get subscription names
               const subscriptionIds = subscriptionDistribution.map(s => s.subscriptionId);
               const subscriptions = await prisma.subscription.findMany({
                    where: { id: { in: subscriptionIds } },
                    select: { id: true, name: true }
               });
               const subscriptionMap = new Map(subscriptions.map(s => [s.id, s.name]));

               // Calculate subscription distribution with percentages
               const totalSubscriptions = subscriptionDistribution.reduce((sum, s) => sum + s._count.id, 0);
               const subscriptionDistributionWithPercentage = subscriptionDistribution.map(s => ({
                    subscriptionName: subscriptionMap.get(s.subscriptionId) || 'Unknown',
                    count: s._count.id,
                    percentage: totalSubscriptions > 0 ? (s._count.id / totalSubscriptions) * 100 : 0
               }));

               // Calculate revenue metrics
               const totalClientRevenue = allClientSubscriptions.reduce((sum, sub) => {
                    const transactionRevenue = sub.transactions.reduce((txSum, tx) => txSum + tx.amount, 0);
                    return sum + transactionRevenue;
               }, 0);

               const averageRevenuePerClient = totalClients > 0 ? totalClientRevenue / totalClients : 0;

               // Calculate MRR (Monthly Recurring Revenue)
               const monthlyRecurringRevenue = allClientSubscriptions
                    .filter(sub => sub.expiryAt && sub.expiryAt >= now)
                    .reduce((sum, sub) => {
                         // Convert subscription price to monthly rate
                         const monthlyRate = sub.subscription.name === "Member" 
                              ? sub.subscription.price / 12 
                              : sub.subscription.price / 3;
                         return sum + monthlyRate;
                    }, 0);

               // Calculate engagement rate
               const clientsEngaged = new Set([...Array(clientsWithReviews), ...Array(clientsWithLikes)]).size;
               const averageEngagementRate = totalClients > 0 ? (clientsEngaged / totalClients) * 100 : 0;

               // Calculate retention metrics
               const expiredAndRenewed = allClientSubscriptions.filter(sub => 
                    sub.transactions.length > 1
               ).length;
               const totalExpired = clientsWithExpiredSubscriptions + clientsWithActiveSubscriptions;
               const subscriptionRenewalRate = totalExpired > 0 ? (expiredAndRenewed / totalExpired) * 100 : 0;
               const churnRate = 100 - subscriptionRenewalRate;

               // Top clients by spending
               const topClients = topClientsData
                    .map(client => {
                         const totalSpent = client.subscription?.transactions.reduce((sum, tx) => sum + tx.amount, 0) || 0;
                         return {
                              id: client.id,
                              name: client.name,
                              email: client.user.email,
                              totalSpent,
                              subscriptionName: client.subscription?.subscription.name || 'None'
                         };
                    })
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 10);

               // Subscription trends (last 6 months)
               const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
               const subscriptionTrends: IClientStats['subscriptionTrends'] = [];
               
               for (let i = 5; i >= 0; i--) {
                    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
                    const monthName = `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
                    
                    const monthData = last6MonthsData.filter(sub => {
                         const created = new Date(sub.createdAt);
                         return created >= monthDate && created <= monthEnd;
                    });
                    
                    const newSubscriptions = monthData.length;
                    const renewals = monthData.filter(sub => 
                         sub.transactions.filter(tx => tx.status === 'Approved').length > 1
                    ).length;
                    const cancellations = monthData.filter(sub =>
                         sub.transactions.some(tx => tx.status === 'Cancelled')
                    ).length;
                    
                    subscriptionTrends.push({
                         month: monthName,
                         newSubscriptions,
                         renewals,
                         cancellations
                    });
               }

               // Get location distribution (use phone prefix or a custom field if location exists)
               // Since Client doesn't have location field, we'll skip this or use a placeholder
               const clientsByLocation: Array<{ location: string; count: number }> = [];
               
               // If you have a location field in Client model, uncomment this:
               /*
               const clientsByLocationData = await prisma.client.groupBy({
                    by: ['location'],
                    _count: { id: true },
                    orderBy: { _count: { id: 'desc' } },
                    take: 10
               });

               clientsByLocation = clientsByLocationData.map(loc => ({
                    location: loc.location || 'Unknown',
                    count: loc._count?.id || 0
               }));
               */

               const stats: IClientStats = {
                    // Overview Metrics
                    totalClients,
                    activeClients: clientsWithActiveSubscriptions,
                    inactiveClients: clientsWithoutSubscriptions,
                    
                    // Subscription Status
                    clientsWithActiveSubscriptions,
                    clientsWithExpiredSubscriptions,
                    clientsWithPendingSubscriptions,
                    clientsWithoutSubscriptions,
                    
                    // Growth Metrics
                    newClientsThisMonth,
                    newClientsLastMonth,
                    growthRate,
                    
                    // Subscription Distribution
                    subscriptionDistribution: subscriptionDistributionWithPercentage,
                    
                    // Revenue Metrics
                    totalClientRevenue,
                    averageRevenuePerClient,
                    monthlyRecurringRevenue,
                    
                    // Engagement Metrics
                    clientsWithReviews,
                    clientsWithLikes,
                    averageEngagementRate,
                    
                    // Retention Metrics
                    subscriptionRenewalRate,
                    churnRate,
                    
                    // Geographic Distribution
                    clientsByLocation,
                    
                    // Recent Activity
                    recentSignups,
                    recentSubscriptions,
                    recentTransactions,
                    
                    // Subscription Trends
                    subscriptionTrends,
                    
                    // Top Clients
                    topClients
               };

               return stats;
          } catch (err) {
               console.error("Error fetching client stats:", err);
               return null;
          }
     },
     ['client-stats'],
     {
          revalidate: 300, // Revalidate every 5 minutes
          tags: ['client-stats']
     }
);

// Helper function to revalidate client stats cache
export async function revalidateClientStats() {
     "use server";
     try {
          const { revalidateTag } = await import('next/cache');
          // @ts-expect-error - Next.js revalidateTag signature varies by version
          revalidateTag('client-stats');
     } catch (error) {
          console.error('Error revalidating client stats:', error);
     }
}

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