"use client";

import { IClientStats } from "@/common/interfaces";
import { PieChart, Crown, Target } from "lucide-react";

interface SubscriptionDistributionProps {
     stats: IClientStats;
}

export default function SubscriptionDistribution({ stats }: SubscriptionDistributionProps) {
     const colors = [
          { bg: 'bg-blue-500', text: 'text-blue-400', light: 'bg-blue-950/30', border: 'border-blue-800' },
          { bg: 'bg-purple-500', text: 'text-purple-400', light: 'bg-purple-950/30', border: 'border-purple-800' },
          { bg: 'bg-green-500', text: 'text-green-400', light: 'bg-green-950/30', border: 'border-green-800' },
          { bg: 'bg-orange-500', text: 'text-orange-400', light: 'bg-orange-950/30', border: 'border-orange-800' },
          { bg: 'bg-pink-500', text: 'text-pink-400', light: 'bg-pink-950/30', border: 'border-pink-800' },
     ];

     return (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
               <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-900/50 rounded-lg">
                         <PieChart className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                         <h3 className="text-xl font-bold text-white">
                              Subscription Distribution
                         </h3>
                         <p className="text-sm text-gray-400">Breakdown by plan type</p>
                    </div>
               </div>

               {stats.subscriptionDistribution.length > 0 ? (
                    <div className="space-y-4">
                         {stats.subscriptionDistribution.map((sub, index) => {
                              const color = colors[index % colors.length];
                              
                              return (
                                   <div key={index} className={`${color.light} ${color.border} border rounded-lg p-4 hover:shadow-md transition-all`}>
                                        <div className="flex items-center justify-between mb-3">
                                             <div className="flex items-center gap-3">
                                                  <div className={`${color.bg} w-3 h-3 rounded-full`} />
                                                  <div>
                                                       <h4 className="font-semibold text-white flex items-center gap-2">
                                                            {sub.subscriptionName}
                                                            {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                                                       </h4>
                                                       <p className="text-sm text-gray-400">
                                                            {sub.count} {sub.count === 1 ? 'client' : 'clients'}
                                                       </p>
                                                  </div>
                                             </div>
                                             <div className="text-right">
                                                  <p className={`text-2xl font-bold ${color.text}`}>
                                                       {sub.percentage.toFixed(1)}%
                                                  </p>
                                             </div>
                                        </div>
                                        
                                        <div className="w-full bg-gray-800 rounded-full h-2">
                                             <div 
                                                  className={`${color.bg} h-2 rounded-full transition-all duration-700`}
                                                  style={{ width: `${sub.percentage}%` }}
                                             />
                                        </div>
                                   </div>
                              );
                         })}
                    </div>
               ) : (
                    <div className="text-center py-12">
                         <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                         <p className="text-gray-500 font-medium">No subscription data available</p>
                         <p className="text-sm text-gray-400 mt-1">Start by creating subscription plans</p>
                    </div>
               )}

               {/* Summary */}
               {stats.subscriptionDistribution.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                         <div className="grid grid-cols-2 gap-4">
                              <div className="text-center">
                                   <p className="text-2xl font-bold text-white">
                                        {stats.subscriptionDistribution.reduce((sum, s) => sum + s.count, 0)}
                                   </p>
                                   <p className="text-sm text-gray-400 mt-1">Total Subscriptions</p>
                              </div>
                              <div className="text-center">
                                   <p className="text-2xl font-bold text-white">
                                        {stats.subscriptionDistribution.length}
                                   </p>
                                   <p className="text-sm text-gray-400 mt-1">Plan Types</p>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
