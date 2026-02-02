import { fetchRecentActivities } from "@/server-actions/admin-dashboard";
import { 
     DollarSign, 
     Package, 
     Users, 
     MessageSquare,
     Clock,
     CheckCircle,
     XCircle,
     AlertCircle,
     TrendingUp
} from "lucide-react";
import Image from "next/image";

export default async function AdminRecentActivities() {
     const activities = await fetchRecentActivities(8);

     if (!activities) {
          return (
               <div className="w-full p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-center">Unable to load recent activities</p>
               </div>
          );
     }

     const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
               case 'verified':
               case 'active':
                    return 'text-green-600 bg-green-50 border-green-200';
               case 'pending':
                    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
               case 'rejected':
               case 'inactive':
                    return 'text-red-600 bg-red-50 border-red-200';
               default:
                    return 'text-gray-600 bg-gray-50 border-gray-200';
          }
     };

     const getStatusIcon = (status: string) => {
          switch (status.toLowerCase()) {
               case 'verified':
               case 'active':
                    return <CheckCircle className="w-4 h-4" />;
               case 'pending':
                    return <Clock className="w-4 h-4" />;
               case 'rejected':
               case 'inactive':
                    return <XCircle className="w-4 h-4" />;
               default:
                    return <AlertCircle className="w-4 h-4" />;
          }
     };

     const formatDate = (date: Date) => {
          const now = new Date();
          const diffMs = now.getTime() - new Date(date).getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          if (diffMins < 60) return `${diffMins}m ago`;
          if (diffHours < 24) return `${diffHours}h ago`;
          return `${diffDays}d ago`;
     };

     return (
          <div className="w-full space-y-6">
               {/* Header */}
               <div className="flex items-center justify-between">
                    <div>
                         <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                              <TrendingUp className="w-7 h-7 text-blue-600" />
                              Recent Activities
                         </h2>
                         <p className="text-sm text-gray-600 mt-1">Latest platform activity and updates</p>
                    </div>
               </div>

               {/* Activity Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                         <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                              <div className="flex items-center gap-2 text-white">
                                   <DollarSign className="w-5 h-5" />
                                   <h3 className="font-bold text-lg">Recent Transactions</h3>
                              </div>
                         </div>
                         <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                              {activities.transactions.length > 0 ? (
                                   activities.transactions.map((transaction) => (
                                        <div
                                             key={transaction.id}
                                             className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                                        >
                                             <div className="flex items-center gap-3 flex-1">
                                                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                                                       <DollarSign className="w-5 h-5 text-blue-600" />
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                       <p className="font-semibold text-gray-900 truncate">{transaction.clientName}</p>
                                                       <p className="text-xs text-gray-500 truncate">{transaction.subscriptionName}</p>
                                                       <p className="text-xs text-gray-400">{formatDate(transaction.createdAt)}</p>
                                                  </div>
                                             </div>
                                             <div className="text-right ml-3">
                                                  <p className="font-bold text-gray-900 whitespace-nowrap">
                                                       RWF {(transaction.amount / 1000).toFixed(0)}K
                                                  </p>
                                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${getStatusColor(transaction.status)}`}>
                                                       {getStatusIcon(transaction.status)}
                                                       {transaction.status}
                                                  </span>
                                             </div>
                                        </div>
                                   ))
                              ) : (
                                   <p className="text-center text-gray-400 py-8">No recent transactions</p>
                              )}
                         </div>
                    </div>

                    {/* Recent Posts */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                         <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                              <div className="flex items-center gap-2 text-white">
                                   <Package className="w-5 h-5" />
                                   <h3 className="font-bold text-lg">Recent Posts</h3>
                              </div>
                         </div>
                         <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                              {activities.posts.length > 0 ? (
                                   activities.posts.map((post) => (
                                        <div
                                             key={post.id}
                                             className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors group"
                                        >
                                             {post.imageUrl ? (
                                                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                                                       <Image
                                                            src={post.imageUrl}
                                                            alt={post.title}
                                                            fill
                                                            className="object-cover"
                                                       />
                                                  </div>
                                             ) : (
                                                  <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                                                       <Package className="w-8 h-8 text-purple-600" />
                                                  </div>
                                             )}
                                             <div className="flex-1 min-w-0">
                                                  <p className="font-semibold text-gray-900 truncate">{post.title}</p>
                                                  <p className="text-xs text-gray-500">{post.vendorName} • {post.categoryName}</p>
                                                  <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                                             </div>
                                             <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${getStatusColor(post.status)}`}>
                                                  {post.status}
                                             </span>
                                        </div>
                                   ))
                              ) : (
                                   <p className="text-center text-gray-400 py-8">No recent posts</p>
                              )}
                         </div>
                    </div>

                    {/* Recent Clients */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                         <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
                              <div className="flex items-center gap-2 text-white">
                                   <Users className="w-5 h-5" />
                                   <h3 className="font-bold text-lg">New Clients</h3>
                              </div>
                         </div>
                         <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                              {activities.clients.length > 0 ? (
                                   activities.clients.map((client) => (
                                        <div
                                             key={client.id}
                                             className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                                        >
                                             <div className="flex items-center gap-3 flex-1">
                                                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center font-bold text-green-700 shadow-sm group-hover:shadow-md transition-shadow">
                                                       {client.name.charAt(0).toUpperCase()}
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                       <p className="font-semibold text-gray-900 truncate">{client.name}</p>
                                                       <p className="text-xs text-gray-500 truncate">{client.email}</p>
                                                       <p className="text-xs text-gray-400">{formatDate(client.createdAt)}</p>
                                                  </div>
                                             </div>
                                             {client.hasSubscription && (
                                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex-shrink-0">
                                                       Subscribed
                                                  </span>
                                             )}
                                        </div>
                                   ))
                              ) : (
                                   <p className="text-center text-gray-400 py-8">No new clients</p>
                              )}
                         </div>
                    </div>

                    {/* Recent Reviews */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                         <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-4">
                              <div className="flex items-center gap-2 text-white">
                                   <MessageSquare className="w-5 h-5" />
                                   <h3 className="font-bold text-lg">Recent Reviews</h3>
                              </div>
                         </div>
                         <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                              {activities.reviews.length > 0 ? (
                                   activities.reviews.map((review) => (
                                        <div
                                             key={review.id}
                                             className="p-3 bg-gray-50 rounded-lg hover:bg-pink-50 transition-colors group"
                                        >
                                             <div className="flex items-start gap-3">
                                                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
                                                       <MessageSquare className="w-5 h-5 text-pink-600" />
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                       <p className="text-sm text-gray-700 line-clamp-2 mb-1">{review.content}</p>
                                                       <p className="text-xs text-gray-500">
                                                            <span className="font-medium">{review.clientName}</span> on{' '}
                                                            <span className="font-medium">{review.postTitle}</span>
                                                       </p>
                                                       <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                                                  </div>
                                             </div>
                                        </div>
                                   ))
                              ) : (
                                   <p className="text-center text-gray-400 py-8">No recent reviews</p>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
}