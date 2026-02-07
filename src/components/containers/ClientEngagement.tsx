"use client";

import { IClientStats } from "@/common/interfaces";
import { Heart, MessageSquare, Target, TrendingUp, TrendingDown } from "lucide-react";

interface ClientEngagementProps {
     stats: IClientStats;
}

export default function ClientEngagement({ stats }: ClientEngagementProps) {
     const retentionIsGood = stats.subscriptionRenewalRate >= 70;
     const churnIsLow = stats.churnRate <= 30;

     return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-100 rounded-lg">
                         <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                         <h3 className="text-xl font-bold text-gray-900">
                              Engagement & Retention
                         </h3>
                         <p className="text-sm text-gray-600">Client activity metrics</p>
                    </div>
               </div>

               <div className="space-y-6">
                    {/* Engagement Rate */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-100">
                         <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                   <Target className="w-5 h-5 text-purple-600" />
                                   <h4 className="font-semibold text-gray-900">Engagement Rate</h4>
                              </div>
                              <span className="text-2xl font-bold text-purple-600">
                                   {stats.averageEngagementRate.toFixed(1)}%
                              </span>
                         </div>
                         <div className="w-full bg-purple-200 rounded-full h-3 mb-3">
                              <div 
                                   className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700"
                                   style={{ width: `${stats.averageEngagementRate}%` }}
                              />
                         </div>
                         <div className="grid grid-cols-2 gap-3 mt-4">
                              <div className="bg-white rounded-lg p-3 text-center">
                                   <MessageSquare className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                                   <p className="text-lg font-bold text-gray-900">{stats.clientsWithReviews}</p>
                                   <p className="text-xs text-gray-600">With Reviews</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 text-center">
                                   <Heart className="w-4 h-4 mx-auto mb-1 text-red-500" />
                                   <p className="text-lg font-bold text-gray-900">{stats.clientsWithLikes}</p>
                                   <p className="text-xs text-gray-600">With Likes</p>
                              </div>
                         </div>
                    </div>

                    {/* Retention Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* Renewal Rate */}
                         <div className={`rounded-lg p-5 border-2 ${
                              retentionIsGood 
                                   ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                                   : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                         }`}>
                              <div className="flex items-center gap-2 mb-3">
                                   {retentionIsGood ? (
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                   ) : (
                                        <TrendingDown className="w-5 h-5 text-amber-600" />
                                   )}
                                   <h4 className="font-semibold text-gray-900">Renewal Rate</h4>
                              </div>
                              <p className={`text-3xl font-bold mb-2 ${
                                   retentionIsGood ? 'text-green-600' : 'text-amber-600'
                              }`}>
                                   {stats.subscriptionRenewalRate.toFixed(1)}%
                              </p>
                              <p className="text-xs text-gray-600">
                                   {retentionIsGood ? 'Excellent retention!' : 'Needs improvement'}
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                   <div 
                                        className={`h-2 rounded-full transition-all duration-700 ${
                                             retentionIsGood ? 'bg-green-500' : 'bg-amber-500'
                                        }`}
                                        style={{ width: `${stats.subscriptionRenewalRate}%` }}
                                   />
                              </div>
                         </div>

                         {/* Churn Rate */}
                         <div className={`rounded-lg p-5 border-2 ${
                              churnIsLow 
                                   ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200' 
                                   : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'
                         }`}>
                              <div className="flex items-center gap-2 mb-3">
                                   {churnIsLow ? (
                                        <TrendingDown className="w-5 h-5 text-blue-600" />
                                   ) : (
                                        <TrendingUp className="w-5 h-5 text-red-600" />
                                   )}
                                   <h4 className="font-semibold text-gray-900">Churn Rate</h4>
                              </div>
                              <p className={`text-3xl font-bold mb-2 ${
                                   churnIsLow ? 'text-blue-600' : 'text-red-600'
                              }`}>
                                   {stats.churnRate.toFixed(1)}%
                              </p>
                              <p className="text-xs text-gray-600">
                                   {churnIsLow ? 'Low churn rate' : 'High churn alert!'}
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                   <div 
                                        className={`h-2 rounded-full transition-all duration-700 ${
                                             churnIsLow ? 'bg-blue-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${stats.churnRate}%` }}
                                   />
                              </div>
                         </div>
                    </div>

                    {/* Insights */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                         <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Key Insights
                         </h4>
                         <ul className="space-y-2 text-sm text-gray-600">
                              <li className="flex items-start gap-2">
                                   <span className="text-blue-500 mt-0.5">•</span>
                                   <span>
                                        <strong>{((stats.clientsWithReviews / stats.totalClients) * 100).toFixed(1)}%</strong> of clients have left reviews
                                   </span>
                              </li>
                              <li className="flex items-start gap-2">
                                   <span className="text-blue-500 mt-0.5">•</span>
                                   <span>
                                        <strong>{((stats.clientsWithLikes / stats.totalClients) * 100).toFixed(1)}%</strong> of clients have liked posts
                                   </span>
                              </li>
                              <li className="flex items-start gap-2">
                                   <span className="text-blue-500 mt-0.5">•</span>
                                   <span>
                                        Overall engagement rate is <strong>{stats.averageEngagementRate.toFixed(1)}%</strong>
                                   </span>
                              </li>
                         </ul>
                    </div>
               </div>
          </div>
     );
}
