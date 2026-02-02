import { fetchPopularPosts, fetchTrendingPosts } from "@/server-actions/admin-dashboard";
import { 
     Heart, 
     MessageSquare, 
     MapPin, 
     Flame,
     Award,
     Star,
     Eye
} from "lucide-react";
import Image from "next/image";

export default async function AdminPopularPosts() {
     const [popularPosts, trendingPosts] = await Promise.all([
          fetchPopularPosts(10),
          fetchTrendingPosts(6)
     ]);

     if (!popularPosts && !trendingPosts) {
          return (
               <div className="w-full p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-center">Unable to load popular posts</p>
               </div>
          );
     }

     return (
          <div className="w-full space-y-6">
               {/* Header */}
               <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                         <Award className="w-7 h-7 text-blue-600" />
                         Popular & Trending Posts
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Top performing posts based on engagement</p>
               </div>

               {/* Trending Posts (Last 7 Days) */}
               {trendingPosts && trendingPosts.posts.length > 0 && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                         <div className="flex items-center gap-2 mb-4">
                              <Flame className="w-6 h-6 text-orange-600" />
                              <h3 className="text-xl font-bold text-gray-900">🔥 Trending This Week</h3>
                              <span className="ml-auto text-xs bg-orange-600 text-white px-3 py-1 rounded-full font-semibold">
                                   HOT
                              </span>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {trendingPosts.posts.map((post, index) => (
                                   <div
                                        key={post.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
                                   >
                                        {/* Rank Badge */}
                                        <div className="absolute top-3 left-3 z-10 bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                                             #{index + 1}
                                        </div>

                                        {/* Image */}
                                        <div className="relative h-40 bg-gray-100 overflow-hidden">
                                             {post.imageUrl ? (
                                                  <Image
                                                       src={post.imageUrl}
                                                       alt={post.title}
                                                       fill
                                                       className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                  />
                                             ) : (
                                                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                                                       <Flame className="w-16 h-16 text-orange-400" />
                                                  </div>
                                             )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                             <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                  {post.title}
                                             </h4>
                                             <p className="text-xs text-gray-500 mb-3">
                                                  {post.categoryName} • {post.vendorName}
                                             </p>
                                             
                                             {/* Engagement Stats */}
                                             <div className="flex items-center justify-between text-xs">
                                                  <div className="flex gap-3">
                                                       <span className="flex items-center gap-1 text-red-600">
                                                            <Heart className="w-3 h-3" />
                                                            {post.likesCount}
                                                       </span>
                                                       <span className="flex items-center gap-1 text-blue-600">
                                                            <MessageSquare className="w-3 h-3" />
                                                            {post.reviewsCount}
                                                       </span>
                                                  </div>
                                                  <span className="font-bold text-orange-600">
                                                       🔥 {Math.round(post.popularityScore)}
                                                  </span>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               )}

               {/* All-Time Popular Posts */}
               {popularPosts && popularPosts.posts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                         <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                              <div className="flex items-center gap-2 text-white">
                                   <Star className="w-6 h-6" />
                                   <h3 className="text-xl font-bold">Most Popular Posts</h3>
                              </div>
                         </div>

                         <div className="overflow-x-auto">
                              <table className="w-full">
                                   <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rank</th>
                                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Post</th>
                                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                                             <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                                                  <Heart className="w-4 h-4 inline" />
                                             </th>
                                             <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                                                  <MessageSquare className="w-4 h-4 inline" />
                                             </th>
                                             <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Score</th>
                                        </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-100">
                                        {popularPosts.posts.map((post, index) => (
                                             <tr key={post.id} className="hover:bg-blue-50 transition-colors group">
                                                  {/* Rank */}
                                                  <td className="px-6 py-4">
                                                       <div className="flex items-center gap-2">
                                                            {index < 3 ? (
                                                                 <span className="text-2xl">
                                                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                                                 </span>
                                                            ) : (
                                                                 <span className="font-bold text-gray-500">#{index + 1}</span>
                                                            )}
                                                       </div>
                                                  </td>

                                                  {/* Post Info */}
                                                  <td className="px-6 py-4">
                                                       <div className="flex items-center gap-3">
                                                            {post.imageUrl ? (
                                                                 <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
                                                                      <Image
                                                                           src={post.imageUrl}
                                                                           alt={post.title}
                                                                           fill
                                                                           className="object-cover"
                                                                      />
                                                                 </div>
                                                            ) : (
                                                                 <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                      <Star className="w-6 h-6 text-blue-600" />
                                                                 </div>
                                                            )}
                                                            <div className="min-w-0">
                                                                 <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                                      {post.title}
                                                                 </p>
                                                                 <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                                                      <MapPin className="w-3 h-3" />
                                                                      {post.location}
                                                                 </p>
                                                            </div>
                                                       </div>
                                                  </td>

                                                  {/* Category */}
                                                  <td className="px-6 py-4">
                                                       <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                                                            {post.categoryName}
                                                       </span>
                                                  </td>

                                                  {/* Vendor */}
                                                  <td className="px-6 py-4">
                                                       <p className="text-sm text-gray-700 font-medium">{post.vendorName}</p>
                                                  </td>

                                                  {/* Likes */}
                                                  <td className="px-6 py-4 text-center">
                                                       <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                                                            <Heart className="w-4 h-4 fill-red-600" />
                                                            {post.likesCount}
                                                       </span>
                                                  </td>

                                                  {/* Reviews */}
                                                  <td className="px-6 py-4 text-center">
                                                       <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                                                            <MessageSquare className="w-4 h-4" />
                                                            {post.reviewsCount}
                                                       </span>
                                                  </td>

                                                  {/* Score */}
                                                  <td className="px-6 py-4 text-center">
                                                       <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-full shadow-sm">
                                                            {Math.round(post.popularityScore)}
                                                       </span>
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         </div>

                         {/* Summary Footer */}
                         <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                              <div className="flex items-center justify-between text-sm">
                                   <p className="text-gray-600">
                                        Showing top {popularPosts.posts.length} posts out of {popularPosts.totalCount} active posts
                                   </p>
                                   <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                             <Eye className="w-4 h-4 text-gray-500" />
                                             <span className="text-gray-700">
                                                  Total Engagement: <span className="font-bold">
                                                       {popularPosts.posts.reduce((sum, p) => sum + p.likesCount + p.reviewsCount, 0)}
                                                  </span>
                                             </span>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
