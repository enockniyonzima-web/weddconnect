"use client";

import { IClientStats } from "@/common/interfaces";
import { PieChart, Crown, Target } from "lucide-react";

interface SubscriptionDistributionProps {
     stats: IClientStats;
}

export default function SubscriptionDistribution({ stats }: SubscriptionDistributionProps) {
     const colors = [
          { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50', border: 'border-blue-200' },
          { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50', border: 'border-purple-200' },
          { bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-50', border: 'border-green-200' },
          { bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50', border: 'border-orange-200' },
          { bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-50', border: 'border-pink-200' },
     ];

     return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                         <PieChart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                         <h3 className="text-xl font-bold text-gray-900">
                              Subscription Distribution
                         </h3>
                         <p className="text-sm text-gray-600">Breakdown by plan type</p>
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
                                                       <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                            {sub.subscriptionName}
                                                            {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                                                       </h4>
                                                       <p className="text-sm text-gray-600">
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
                                        
                                        <div className="w-full bg-gray-200 rounded-full h-2">
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
                    <div className="mt-6 pt-6 border-t border-gray-200">
                         <div className="grid grid-cols-2 gap-4">
                              <div className="text-center">
                                   <p className="text-2xl font-bold text-gray-900">
                                        {stats.subscriptionDistribution.reduce((sum, s) => sum + s.count, 0)}
                                   </p>
                                   <p className="text-sm text-gray-600 mt-1">Total Subscriptions</p>
                              </div>
                              <div className="text-center">
                                   <p className="text-2xl font-bold text-gray-900">
                                        {stats.subscriptionDistribution.length}
                                   </p>
                                   <p className="text-sm text-gray-600 mt-1">Plan Types</p>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
