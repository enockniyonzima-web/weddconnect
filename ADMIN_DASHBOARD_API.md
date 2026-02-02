# Admin Dashboard API Documentation

## Overview
This document describes the server actions implemented for the admin dashboard, including statistics, recent activities, and popular posts functionality.

## 📊 Available Server Actions

### 1. `fetchAdminStats()`
Fetches comprehensive platform statistics for admin dashboard.

**Cache:** 5 minutes (300 seconds)  
**Returns:** `IAdminStats | null`

#### Metrics Included:
- **User Statistics**
  - Total users, clients, vendors, admins
  - Active users count
  
- **Post Statistics**
  - Total posts, active posts, pending posts
  - Posts breakdown by category
  
- **Financial Metrics**
  - Total revenue
  - Transaction counts (total, pending, verified)
  - Average transaction value
  
- **Subscription Statistics**
  - Total and active subscriptions
  - Subscriptions by type
  
- **Engagement Metrics**
  - Total reviews and likes
  
- **Recent Activity (Last 30 days)**
  - Recent transactions, posts, and new clients

#### Usage:
```typescript
import { fetchAdminStats } from '@/server-actions/admin-dashboard';

const stats = await fetchAdminStats();
if (stats) {
  console.log('Total Users:', stats.totalUsers);
  console.log('Total Revenue:', stats.totalRevenue);
}
```

---

### 2. `fetchRecentActivities(limit?: number)`
Fetches the most recent platform activities across all entities.

**Parameters:**
- `limit` (optional): Number of items per category (default: 10)

**Cache:** 1 minute (60 seconds)  
**Returns:** `IRecentActivity | null`

#### Data Included:
- **Recent Transactions**: Latest payment transactions with client and subscription info
- **Recent Posts**: Latest posts with vendor, category, and image
- **Recent Clients**: Newly registered clients with subscription status
- **Recent Reviews**: Latest reviews with client and post info
- **Recent Vendors**: Newly registered vendors with post count

#### Usage:
```typescript
import { fetchRecentActivities } from '@/server-actions/admin-dashboard';

const activities = await fetchRecentActivities(15); // Get last 15 items
if (activities) {
  console.log('Recent Transactions:', activities.transactions);
  console.log('Recent Posts:', activities.posts);
}
```

---

### 3. `fetchPopularPosts(limit?, categoryId?, location?)`
Fetches popular posts based on engagement metrics (likes and reviews).

**Parameters:**
- `limit` (optional): Maximum number of posts to return (default: 20)
- `categoryId` (optional): Filter by specific category
- `location` (optional): Filter by location

**Cache:** 5 minutes (300 seconds)  
**Returns:** `IPopularPostsResponse | null`

#### Popularity Algorithm:
- Each like: **1 point**
- Each review: **3 points** (reviews are more valuable)
- Recency bonus: Posts created in last 30 days get **20% boost**

**Formula:** `(likes × 1 + reviews × 3) × recencyBonus`

#### Response Structure:
```typescript
{
  posts: [
    {
      id, title, description, categoryName, vendorName,
      location, imageUrl, likesCount, reviewsCount,
      averageRating, popularityScore,
      minPrice, maxPrice, currency, createdAt
    }
  ],
  totalCount: number
}
```

#### Usage:
```typescript
import { fetchPopularPosts } from '@/server-actions/admin-dashboard';

// Get all popular posts
const allPopular = await fetchPopularPosts();

// Get popular posts in specific category
const weddingPlanners = await fetchPopularPosts(10, 1); // categoryId = 1

// Get popular posts in Kigali
const kigaliPosts = await fetchPopularPosts(10, undefined, 'Kigali');
```

---

### 4. `fetchTrendingPosts(limit?: number)`
Fetches posts that are currently trending (popular in the last 7 days).

**Parameters:**
- `limit` (optional): Maximum number of posts to return (default: 10)

**Cache:** 3 minutes (180 seconds)  
**Returns:** `IPopularPostsResponse | null`

#### Trending Algorithm:
Focuses on **recent engagement** (last 7 days):
- Recent likes: **2 points each**
- Recent reviews: **5 points each**

**Formula:** `(recentLikes × 2) + (recentReviews × 5)`

#### Usage:
```typescript
import { fetchTrendingPosts } from '@/server-actions/admin-dashboard';

const trending = await fetchTrendingPosts(20);
if (trending) {
  console.log('Trending Posts:', trending.posts);
  console.log('Total Trending Count:', trending.totalCount);
}
```

---

## 🔄 Cache Revalidation Functions

### Manual Cache Refresh
When you need to force-refresh cached data (e.g., after major data changes):

```typescript
import { 
  revalidateAdminStats,
  revalidateRecentActivities,
  revalidatePopularPosts
} from '@/server-actions/admin-dashboard';

// Refresh specific cache
await revalidateAdminStats();
await revalidateRecentActivities();
await revalidatePopularPosts(); // Refreshes both popular and trending
```

---

## 📦 TypeScript Interfaces

All interfaces are defined in `/src/common/interfaces.ts`:

- `IAdminStats` - Complete admin statistics
- `IRecentActivity` - Recent platform activities
- `IRecentTransaction`, `IRecentPost`, `IRecentClient`, `IRecentReview`, `IRecentVendor` - Individual activity types
- `IPopularPost` - Popular/trending post with engagement metrics
- `IPopularPostsResponse` - Response containing posts array and total count

---

## 🚀 Performance & Caching

### Cache Strategy
All functions use **Next.js `unstable_cache`** which provides:
- ✅ Server-side persistent caching
- ✅ Automatic revalidation on intervals
- ✅ Manual revalidation via tags
- ✅ Better performance than React's `cache()`

### Cache Durations
| Function | Cache Duration | Rationale |
|----------|---------------|-----------|
| `fetchAdminStats` | 5 minutes | Aggregate stats change slowly |
| `fetchRecentActivities` | 1 minute | Need fresh activity data |
| `fetchPopularPosts` | 5 minutes | Popularity changes gradually |
| `fetchTrendingPosts` | 3 minutes | Trending is more dynamic |

### Optimization Tips
1. **Parallel Queries**: All functions use `Promise.all()` for optimal performance
2. **Strategic Includes**: Only fetches necessary related data
3. **Computed Metrics**: Popularity scores calculated in-memory after fetching
4. **Minimal Over-fetching**: Posts are fetched with limit × 2 for scoring, then trimmed

---

## 🎯 Example: Building an Admin Dashboard

```typescript
import {
  fetchAdminStats,
  fetchRecentActivities,
  fetchTrendingPosts
} from '@/server-actions/admin-dashboard';

export default async function AdminDashboard() {
  const [stats, activities, trending] = await Promise.all([
    fetchAdminStats(),
    fetchRecentActivities(5),
    fetchTrendingPosts(10)
  ]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <StatsGrid stats={stats} />
      
      {/* Recent Activity Feed */}
      <RecentActivityFeed activities={activities} />
      
      {/* Trending Posts */}
      <TrendingPosts posts={trending?.posts} />
    </div>
  );
}
```

---

## 🔧 Database Queries Summary

### `fetchAdminStats` - ~20 queries (parallelized)
- User counts, post counts, transaction aggregations
- Category and subscription groupings

### `fetchRecentActivities` - 5 queries (parallelized)
- Latest transactions, posts, clients, reviews, vendors

### `fetchPopularPosts` - 2 queries
1. Posts with engagement metrics
2. Category/subscription name lookups

### `fetchTrendingPosts` - 1 query
- Posts with recent engagement within 7 days

---

## 📝 Notes

1. All functions are **server-side only** (`"use server"`)
2. Error handling returns `null` on failure with console logging
3. Date calculations use local timezone
4. Active posts only (status = 'active') for public-facing data
5. Prices and currency info included where available

---

## 🛠️ Future Enhancements

Potential improvements:
- [ ] Add pagination for recent activities
- [ ] Implement real rating system (currently averageRating is 0)
- [ ] Add date range filters
- [ ] Export functionality for reports
- [ ] Real-time updates via WebSocket
- [ ] Role-based data filtering (SUPER_ADMIN vs ADMIN)
