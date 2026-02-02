import { fetchAdminStats } from "@/server-actions/admin-dashboard";
import { 
     Users, 
     ShoppingBag, 
     DollarSign, 
     TrendingUp, 
     UserCheck, 
     Package, 
     Star, 
     Heart,
     Clock,
     Activity
} from "lucide-react";

export default async function AdminStats() {
     const stats = await fetchAdminStats();

     if (!stats) {
          return (
               <div className="w-full p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-center">Unable to load statistics</p>
               </div>
          );
     }

     const statCards = [
          {
               title: "Total Users",
               value: stats.totalUsers.toLocaleString(),
               subtitle: `${stats.activeUsers} active`,
               icon: Users,
               color: "blue",
               trend: "+12%",
               bgGradient: "from-blue-500 to-blue-600"
          },
          {
               title: "Total Revenue",
               value: `RWF ${(stats.totalRevenue / 1000000).toFixed(1)}M`,
               subtitle: `${stats.totalTransactions} transactions`,
               icon: DollarSign,
               color: "green",
               trend: "+23%",
               bgGradient: "from-green-500 to-green-600"
          },
          {
               title: "Active Posts",
               value: stats.activePosts.toLocaleString(),
               subtitle: `${stats.totalPosts} total posts`,
               icon: Package,
               color: "purple",
               trend: "+8%",
               bgGradient: "from-purple-500 to-purple-600"
          },
          {
               title: "Engagement",
               value: (stats.totalLikes + stats.totalReviews).toLocaleString(),
               subtitle: `${stats.totalReviews} reviews, ${stats.totalLikes} likes`,
               icon: Heart,
               color: "pink",
               trend: "+15%",
               bgGradient: "from-pink-500 to-pink-600"
          }
     ];

     const quickStats = [
          { label: "Vendors", value: stats.totalVendors, icon: ShoppingBag, color: "text-blue-600" },
          { label: "Clients", value: stats.totalClients, icon: UserCheck, color: "text-blue-600" },
          { label: "Subscriptions", value: stats.activeSubscriptions, icon: Star, color: "text-blue-600" },
          { label: "Pending Posts", value: stats.pendingPosts, icon: Clock, color: "text-orange-600" }
     ];

     return (
          <div className="w-full space-y-6">
               {/* Main Stat Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                         <div
                              key={index}
                              className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
                         >
                              {/* Gradient Background */}
                              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`}></div>
                              
                              <div className="p-6 relative">
                                   <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 bg-gradient-to-br ${stat.bgGradient} rounded-lg shadow-lg`}>
                                             <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                             {stat.trend}
                                        </span>
                                   </div>
                                   
                                   <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                                   <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                                   <p className="text-xs text-gray-500">{stat.subtitle}</p>
                              </div>
                         </div>
                    ))}
               </div>

               {/* Quick Stats Grid */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                         <Activity className="w-5 h-5 text-blue-600" />
                         <h3 className="text-lg font-bold text-gray-900">Quick Overview</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {quickStats.map((item, index) => (
                              <div
                                   key={index}
                                   className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                   <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                   </div>
                                   <div>
                                        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                        <p className="text-xs text-gray-600">{item.label}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>

               {/* Categories & Subscriptions */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Posts by Category */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                         <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-blue-600" />
                              Posts by Category
                         </h3>
                         <div className="space-y-3">
                              {stats.postsByCategory.slice(0, 5).map((category, index) => {
                                   const maxCount = Math.max(...stats.postsByCategory.map(c => c.count));
                                   const percentage = (category.count / maxCount) * 100;
                                   
                                   return (
                                        <div key={index} className="group">
                                             <div className="flex justify-between text-sm mb-2">
                                                  <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                                       {category.categoryName}
                                                  </span>
                                                  <span className="font-bold text-gray-900">{category.count}</span>
                                             </div>
                                             <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                  <div 
                                                       className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-blue-700"
                                                       style={{ width: `${percentage}%` }}
                                                  />
                                             </div>
                                        </div>
                                   );
                              })}
                         </div>
                    </div>

                    {/* Subscriptions by Type */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                         <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Star className="w-5 h-5 text-blue-600" />
                              Active Subscriptions
                         </h3>
                         <div className="space-y-3">
                              {stats.subscriptionsByType.map((subscription, index) => {
                                   const total = stats.subscriptionsByType.reduce((sum, s) => sum + s.count, 0);
                                   const percentage = (subscription.count / total) * 100;
                                   
                                   return (
                                        <div key={index} className="group">
                                             <div className="flex justify-between text-sm mb-2">
                                                  <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                                       {subscription.subscriptionName}
                                                  </span>
                                                  <span className="font-bold text-gray-900">
                                                       {subscription.count} ({percentage.toFixed(1)}%)
                                                  </span>
                                             </div>
                                             <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                  <div 
                                                       className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500 group-hover:from-green-600 group-hover:to-green-700"
                                                       style={{ width: `${percentage}%` }}
                                                  />
                                             </div>
                                        </div>
                                   );
                              })}
                         </div>
                    </div>
               </div>

               {/* Recent Activity Summary */}
               <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                         <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">Last 30 Days Activity</h3>
                              <p className="text-sm text-gray-600">Recent platform growth and engagement</p>
                         </div>
                         <div className="flex gap-6">
                              <div className="text-center">
                                   <p className="text-3xl font-bold text-blue-600">{stats.recentTransactions}</p>
                                   <p className="text-xs text-gray-600 mt-1">Transactions</p>
                              </div>
                              <div className="text-center">
                                   <p className="text-3xl font-bold text-blue-600">{stats.recentPosts}</p>
                                   <p className="text-xs text-gray-600 mt-1">New Posts</p>
                              </div>
                              <div className="text-center">
                                   <p className="text-3xl font-bold text-blue-600">{stats.recentClients}</p>
                                   <p className="text-xs text-gray-600 mt-1">New Clients</p>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}