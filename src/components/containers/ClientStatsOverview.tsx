"use client";

import { IClientStats } from "@/common/interfaces";
import { Users, UserCheck, UserX, TrendingUp, TrendingDown, DollarSign, Calendar, Activity } from "lucide-react";

interface ClientStatsOverviewProps {
     stats: IClientStats;
}

export default function ClientStatsOverview({ stats }: ClientStatsOverviewProps) {
     const growthIsPositive = stats.growthRate >= 0;

     return (
          <div className="w-full">
               {/* Main Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Clients */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                         <div className="flex items-center justify-between mb-4">
                              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                   <Users className="w-6 h-6 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-500">Total</span>
                         </div>
                         <h3 className="text-3xl font-bold text-gray-900 mb-1">
                              {stats.totalClients.toLocaleString()}
                         </h3>
                         <p className="text-sm text-gray-600">Total Clients</p>
                         <div className="mt-3 pt-3 border-t border-gray-100">
                              <span className="text-xs text-gray-500">
                                   {stats.newClientsThisMonth} new this month
                              </span>
                         </div>
                    </div>

                    {/* Active Clients */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                         <div className="flex items-center justify-between mb-4">
                              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                                   <UserCheck className="w-6 h-6 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-500">Active</span>
                         </div>
                         <h3 className="text-3xl font-bold text-gray-900 mb-1">
                              {stats.activeClients.toLocaleString()}
                         </h3>
                         <p className="text-sm text-gray-600">Active Subscriptions</p>
                         <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-1">
                                   <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div 
                                             className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                             style={{ width: `${(stats.activeClients / stats.totalClients) * 100}%` }}
                                        />
                                   </div>
                                   <span className="text-xs font-medium text-gray-700">
                                        {((stats.activeClients / stats.totalClients) * 100).toFixed(1)}%
                                   </span>
                              </div>
                         </div>
                    </div>

                    {/* Growth Rate */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                         <div className="flex items-center justify-between mb-4">
                              <div className={`p-3 rounded-lg ${
                                   growthIsPositive 
                                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                                        : 'bg-gradient-to-br from-red-500 to-red-600'
                              }`}>
                                   {growthIsPositive ? (
                                        <TrendingUp className="w-6 h-6 text-white" />
                                   ) : (
                                        <TrendingDown className="w-6 h-6 text-white" />
                                   )}
                              </div>
                              <span className="text-sm font-medium text-gray-500">Growth</span>
                         </div>
                         <h3 className={`text-3xl font-bold mb-1 ${
                              growthIsPositive ? 'text-emerald-600' : 'text-red-600'
                         }`}>
                              {growthIsPositive ? '+' : ''}{stats.growthRate.toFixed(1)}%
                         </h3>
                         <p className="text-sm text-gray-600">Monthly Growth</p>
                         <div className="mt-3 pt-3 border-t border-gray-100">
                              <span className="text-xs text-gray-500">
                                   vs. last month ({stats.newClientsLastMonth})
                              </span>
                         </div>
                    </div>

                    {/* Revenue */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                         <div className="flex items-center justify-between mb-4">
                              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                                   <DollarSign className="w-6 h-6 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-500">Revenue</span>
                         </div>
                         <h3 className="text-3xl font-bold text-gray-900 mb-1">
                              ${stats.totalClientRevenue.toLocaleString()}
                         </h3>
                         <p className="text-sm text-gray-600">Total Revenue</p>
                         <div className="mt-3 pt-3 border-t border-gray-100">
                              <span className="text-xs text-gray-500">
                                   ${stats.averageRevenuePerClient.toFixed(2)} avg/client
                              </span>
                         </div>
                    </div>
               </div>

               {/* Secondary Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Pending Subscriptions */}
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                         <div className="flex items-center gap-3 mb-2">
                              <Calendar className="w-5 h-5 text-amber-600" />
                              <h4 className="font-semibold text-amber-900">Pending</h4>
                         </div>
                         <p className="text-2xl font-bold text-amber-900">
                              {stats.clientsWithPendingSubscriptions}
                         </p>
                         <p className="text-sm text-amber-700 mt-1">Awaiting approval</p>
                    </div>

                    {/* Expired Subscriptions */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                         <div className="flex items-center gap-3 mb-2">
                              <UserX className="w-5 h-5 text-red-600" />
                              <h4 className="font-semibold text-red-900">Expired</h4>
                         </div>
                         <p className="text-2xl font-bold text-red-900">
                              {stats.clientsWithExpiredSubscriptions}
                         </p>
                         <p className="text-sm text-red-700 mt-1">Need renewal</p>
                    </div>

                    {/* No Subscription */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                         <div className="flex items-center gap-3 mb-2">
                              <Users className="w-5 h-5 text-gray-600" />
                              <h4 className="font-semibold text-gray-900">No Subscription</h4>
                         </div>
                         <p className="text-2xl font-bold text-gray-900">
                              {stats.clientsWithoutSubscriptions}
                         </p>
                         <p className="text-sm text-gray-700 mt-1">Free tier</p>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                         <div className="flex items-center gap-3 mb-2">
                              <Activity className="w-5 h-5 text-blue-600" />
                              <h4 className="font-semibold text-blue-900">Last 7 Days</h4>
                         </div>
                         <p className="text-2xl font-bold text-blue-900">
                              {stats.recentSignups}
                         </p>
                         <p className="text-sm text-blue-700 mt-1">New signups</p>
                    </div>
               </div>
          </div>
     );
}
