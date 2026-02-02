// Example Component: Admin Dashboard Page
// File: src/app/dashboard/admin/page.tsx

import {
  fetchAdminStats,
  fetchRecentActivities,
  fetchPopularPosts,
  fetchTrendingPosts
} from '@/server-actions/admin-dashboard';

export default async function AdminDashboardPage() {
  // Fetch all data in parallel for optimal performance
  const [stats, recentActivities, popularPosts, trendingPosts] = await Promise.all([
    fetchAdminStats(),
    fetchRecentActivities(10),
    fetchPopularPosts(20),
    fetchTrendingPosts(10)
  ]);

  // Handle loading states
  if (!stats) {
    return <div>Error loading statistics</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.activeUsers} active`}
          icon="👥"
        />
        <StatCard
          title="Total Revenue"
          value={`RWF ${stats.totalRevenue.toLocaleString()}`}
          subtitle={`${stats.totalTransactions} transactions`}
          icon="💰"
        />
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          subtitle={`${stats.activePosts} active`}
          icon="📝"
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          subtitle={`${stats.totalLikes} likes`}
          icon="⭐"
        />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Posts by Category</h2>
          <CategoryChart data={stats.postsByCategory} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Subscriptions</h2>
          <SubscriptionChart data={stats.subscriptionsByType} />
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            {recentActivities?.transactions.map(transaction => (
              <div key={transaction.id} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{transaction.clientName}</p>
                  <p className="text-sm text-gray-500">{transaction.subscriptionName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">RWF {transaction.amount.toLocaleString()}</p>
                  <p className={`text-sm ${
                    transaction.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Posts */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
            {recentActivities?.posts.map(post => (
              <div key={post.id} className="flex gap-4 py-2 border-b">
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-gray-500">
                    {post.vendorName} • {post.categoryName}
                  </p>
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  post.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Posts */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Trending Posts (Last 7 Days)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPosts?.posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
              {post.imageUrl && (
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {post.categoryName} • {post.location}
                </p>
                <div className="flex justify-between text-sm">
                  <span>❤️ {post.likesCount} likes</span>
                  <span>⭐ {post.reviewsCount} reviews</span>
                </div>
                <div className="mt-2 text-sm font-semibold text-blue-600">
                  Score: {Math.round(post.popularityScore)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Posts (All Time) */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Most Popular Posts</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Post</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Vendor</th>
                <th className="px-6 py-3 text-center">Likes</th>
                <th className="px-6 py-3 text-center">Reviews</th>
                <th className="px-6 py-3 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {popularPosts?.posts.slice(0, 10).map(post => (
                <tr key={post.id} className="border-t">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.imageUrl && (
                        <img 
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-gray-500">{post.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{post.categoryName}</td>
                  <td className="px-6 py-4">{post.vendorName}</td>
                  <td className="px-6 py-4 text-center">{post.likesCount}</td>
                  <td className="px-6 py-4 text-center">{post.reviewsCount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-blue-600">
                      {Math.round(post.popularityScore)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, subtitle, icon }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function CategoryChart({ data }: { data: Array<{ categoryName: string; count: number }> }) {
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <div className="space-y-3">
      {data.map(category => (
        <div key={category.categoryName}>
          <div className="flex justify-between text-sm mb-1">
            <span>{category.categoryName}</span>
            <span className="font-medium">{category.count}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(category.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SubscriptionChart({ data }: { data: Array<{ subscriptionName: string; count: number }> }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="space-y-3">
      {data.map(subscription => {
        const percentage = (subscription.count / total) * 100;
        return (
          <div key={subscription.subscriptionName}>
            <div className="flex justify-between text-sm mb-1">
              <span>{subscription.subscriptionName}</span>
              <span className="font-medium">
                {subscription.count} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
