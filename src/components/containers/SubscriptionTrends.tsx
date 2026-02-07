"use client";

import { IClientStats } from "@/common/interfaces";
import { TrendingUp, Users, RefreshCw, XCircle } from "lucide-react";

interface SubscriptionTrendsProps {
     stats: IClientStats;
}

export default function SubscriptionTrends({ stats }: SubscriptionTrendsProps) {
     // Find max value for scaling
     const maxValue = Math.max(
          ...stats.subscriptionTrends.flatMap(t => [
               t.newSubscriptions,
               t.renewals,
               t.cancellations
          ])
     );

     return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <div className="flex items-center justify-between mb-6">
                    <div>
                         <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                              <TrendingUp className="w-6 h-6 text-blue-600" />
                              Subscription Trends
                         </h3>
                         <p className="text-sm text-gray-600 mt-1">Last 6 months activity</p>
                    </div>
               </div>

               {/* Chart */}
               <div className="space-y-6">
                    {stats.subscriptionTrends.map((trend, index) => {
                         const total = trend.newSubscriptions + trend.renewals + trend.cancellations;
                         const newWidth = maxValue > 0 ? (trend.newSubscriptions / maxValue) * 100 : 0;
                         const renewalWidth = maxValue > 0 ? (trend.renewals / maxValue) * 100 : 0;
                         const cancelWidth = maxValue > 0 ? (trend.cancellations / maxValue) * 100 : 0;

                         return (
                              <div key={index} className="space-y-2">
                                   <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                                             {trend.month}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                             {total} total
                                        </span>
                                   </div>
                                   
                                   <div className="flex gap-1 h-8">
                                        {/* New Subscriptions */}
                                        {trend.newSubscriptions > 0 && (
                                             <div 
                                                  className="bg-green-500 rounded hover:bg-green-600 transition-all flex items-center justify-center text-white text-xs font-medium group relative"
                                                  style={{ width: `${newWidth}%` }}
                                                  title={`${trend.newSubscriptions} new`}
                                             >
                                                  {newWidth > 15 && trend.newSubscriptions}
                                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                       {trend.newSubscriptions} New
                                                  </div>
                                             </div>
                                        )}
                                        
                                        {/* Renewals */}
                                        {trend.renewals > 0 && (
                                             <div 
                                                  className="bg-blue-500 rounded hover:bg-blue-600 transition-all flex items-center justify-center text-white text-xs font-medium group relative"
                                                  style={{ width: `${renewalWidth}%` }}
                                                  title={`${trend.renewals} renewals`}
                                             >
                                                  {renewalWidth > 15 && trend.renewals}
                                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                       {trend.renewals} Renewals
                                                  </div>
                                             </div>
                                        )}
                                        
                                        {/* Cancellations */}
                                        {trend.cancellations > 0 && (
                                             <div 
                                                  className="bg-red-500 rounded hover:bg-red-600 transition-all flex items-center justify-center text-white text-xs font-medium group relative"
                                                  style={{ width: `${cancelWidth}%` }}
                                                  title={`${trend.cancellations} cancelled`}
                                             >
                                                  {cancelWidth > 15 && trend.cancellations}
                                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                       {trend.cancellations} Cancelled
                                                  </div>
                                             </div>
                                        )}
                                        
                                        {/* Fill remaining space if total is 0 */}
                                        {total === 0 && (
                                             <div className="flex-1 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                                                  No activity
                                             </div>
                                        )}
                                   </div>
                              </div>
                         );
                    })}
               </div>

               {/* Legend */}
               <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center gap-2">
                         <Users className="w-4 h-4 text-green-500" />
                         <span className="text-sm text-gray-600">New Subscriptions</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <RefreshCw className="w-4 h-4 text-blue-500" />
                         <span className="text-sm text-gray-600">Renewals</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <XCircle className="w-4 h-4 text-red-500" />
                         <span className="text-sm text-gray-600">Cancellations</span>
                    </div>
               </div>
          </div>
     );
}
