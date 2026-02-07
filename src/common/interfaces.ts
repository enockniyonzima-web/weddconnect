import { EAspectRatio } from "./enums"

export interface IFileUploader {
     cb: (res:string) => unknown
     multicb?:(res: Array<string>) => unknown
     close: () => unknown
     title: string
     multipleFile?:boolean
     limit?:number
     aspectRatio?: EAspectRatio 
     uploadFolder?:string
}

export interface IAdminStats {
     // User Statistics
     totalUsers: number;
     totalClients: number;
     totalVendors: number;
     totalAdmins: number;
     activeUsers: number;
     
     // Post Statistics
     totalPosts: number;
     activePosts: number;
     pendingPosts: number;
     postsByCategory: Array<{
          categoryName: string;
          count: number;
     }>;
     
     // Financial Metrics
     totalRevenue: number;
     totalTransactions: number;
     pendingTransactions: number;
     verifiedTransactions: number;
     averageTransactionValue: number;
     
     // Subscription Statistics
     totalSubscriptions: number;
     activeSubscriptions: number;
     subscriptionsByType: Array<{
          subscriptionName: string;
          count: number;
     }>;
     
     // Engagement Metrics
     totalReviews: number;
     totalLikes: number;
     averagePostRating: number;
     
     // Recent Activity (Last 30 days)
     recentTransactions: number;
     recentPosts: number;
     recentClients: number;
}

export interface IRecentActivity {
     transactions: IRecentTransaction[];
     posts: IRecentPost[];
     clients: IRecentClient[];
     reviews: IRecentReview[];
     vendors: IRecentVendor[];
}

export interface IRecentTransaction {
     id: number;
     amount: number;
     status: string;
     transactionMethod: string;
     createdAt: Date;
     clientName: string;
     subscriptionName: string;
}

export interface IRecentPost {
     id: number;
     title: string;
     status: string;
     createdAt: Date;
     vendorName: string;
     categoryName: string;
     imageUrl?: string;
}

export interface IRecentClient {
     id: number;
     name: string;
     email: string;
     phone: string;
     createdAt: Date;
     hasSubscription: boolean;
}

export interface IRecentReview {
     id: number;
     content: string;
     type: string;
     createdAt: Date;
     clientName: string;
     postTitle: string;
}

export interface IRecentVendor {
     id: number;
     name: string;
     email: string;
     status: boolean;
     createdAt: Date;
     totalPosts: number;
}

export interface IPopularPost {
     id: number;
     title: string;
     description: string;
     categoryName: string;
     vendorName: string;
     location: string;
     imageUrl?: string;
     
     // Engagement metrics
     likesCount: number;
     reviewsCount: number;
     averageRating: number;
     
     // Popularity score (calculated from likes, reviews, etc.)
     popularityScore: number;
     
     // Price info
     minPrice?: number;
     maxPrice?: number;
     currency?: string;
     
     createdAt: Date;
}

export interface IPopularPostsResponse {
     posts: IPopularPost[];
     totalCount: number;
}

export interface IClientStats {
     // Overview Metrics
     totalClients: number;
     activeClients: number; // Clients with active subscriptions
     inactiveClients: number; // Clients without subscriptions
     
     // Subscription Status
     clientsWithActiveSubscriptions: number;
     clientsWithExpiredSubscriptions: number;
     clientsWithPendingSubscriptions: number;
     clientsWithoutSubscriptions: number;
     
     // Growth Metrics
     newClientsThisMonth: number;
     newClientsLastMonth: number;
     growthRate: number; // Percentage growth
     
     // Subscription Distribution
     subscriptionDistribution: Array<{
          subscriptionName: string;
          count: number;
          percentage: number;
     }>;
     
     // Revenue Metrics (from client subscriptions)
     totalClientRevenue: number;
     averageRevenuePerClient: number;
     monthlyRecurringRevenue: number;
     
     // Engagement Metrics
     clientsWithReviews: number;
     clientsWithLikes: number;
     averageEngagementRate: number;
     
     // Retention Metrics
     subscriptionRenewalRate: number;
     churnRate: number;
     
     // Geographic Distribution
     clientsByLocation: Array<{
          location: string;
          count: number;
     }>;
     
     // Recent Activity
     recentSignups: number; // Last 7 days
     recentSubscriptions: number; // Last 7 days
     recentTransactions: number; // Last 7 days
     
     // Subscription Trends (Last 6 months)
     subscriptionTrends: Array<{
          month: string;
          newSubscriptions: number;
          renewals: number;
          cancellations: number;
     }>;
     
     // Top Clients (by spending)
     topClients: Array<{
          id: number;
          name: string;
          email: string;
          totalSpent: number;
          subscriptionName: string;
     }>;
}