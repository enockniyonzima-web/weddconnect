"use client";

import { IClientStats } from "@/common/interfaces";
import { Trophy, DollarSign, Mail, CreditCard } from "lucide-react";

interface TopClientsProps {
     stats: IClientStats;
}

export default function TopClients({ stats }: TopClientsProps) {
     const medals = ['🥇', '🥈', '🥉'];

     return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                         <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                         <h3 className="text-xl font-bold text-gray-900">
                              Top Clients
                         </h3>
                         <p className="text-sm text-gray-600">Highest spending customers</p>
                    </div>
               </div>

               {stats.topClients.length > 0 ? (
                    <div className="space-y-3">
                         {stats.topClients.map((client, index) => (
                              <div 
                                   key={client.id} 
                                   className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                                        index < 3 
                                             ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                                             : 'bg-gray-50 border-gray-200'
                                   }`}
                              >
                                   {/* Rank */}
                                   <div className="flex-shrink-0">
                                        {index < 3 ? (
                                             <div className="text-3xl">
                                                  {medals[index]}
                                             </div>
                                        ) : (
                                             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                  <span className="text-sm font-bold text-gray-600">
                                                       #{index + 1}
                                                  </span>
                                             </div>
                                        )}
                                   </div>

                                   {/* Client Info */}
                                   <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 truncate mb-1">
                                             {client.name}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-600">
                                             <div className="flex items-center gap-1">
                                                  <Mail className="w-3 h-3" />
                                                  <span className="truncate">{client.email}</span>
                                             </div>
                                             <div className="flex items-center gap-1">
                                                  <CreditCard className="w-3 h-3" />
                                                  <span>{client.subscriptionName}</span>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Spending */}
                                   <div className="flex-shrink-0 text-right">
                                        <div className="flex items-center gap-1 text-green-600 font-bold">
                                             <DollarSign className="w-4 h-4" />
                                             <span className="text-lg">
                                                  {client.totalSpent.toLocaleString()}
                                             </span>
                                        </div>
                                        <p className="text-xs text-gray-500">Total Spent</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               ) : (
                    <div className="text-center py-12">
                         <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                         <p className="text-gray-500 font-medium">No client data available</p>
                         <p className="text-sm text-gray-400 mt-1">Start tracking client revenue</p>
                    </div>
               )}

               {/* Summary Stats */}
               {stats.topClients.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                         <div className="grid grid-cols-2 gap-4">
                              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                                   <p className="text-sm text-gray-600 mb-1">Avg Revenue</p>
                                   <p className="text-xl font-bold text-blue-600">
                                        ${stats.averageRevenuePerClient.toFixed(2)}
                                   </p>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                                   <p className="text-sm text-gray-600 mb-1">Monthly MRR</p>
                                   <p className="text-xl font-bold text-purple-600">
                                        ${stats.monthlyRecurringRevenue.toFixed(2)}
                                   </p>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
