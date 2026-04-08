"use client";

import { IClientStats } from "@/common/interfaces";
import { MapPin, Users } from "lucide-react";

interface ClientGeographyProps {
     stats: IClientStats;
}

export default function ClientGeography({ stats }: ClientGeographyProps) {
     const maxCount = Math.max(...stats.clientsByLocation.map(l => l.count));

     return (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
               <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-900/50 rounded-lg">
                         <MapPin className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                         <h3 className="text-xl font-bold text-white">
                              Geographic Distribution
                         </h3>
                         <p className="text-sm text-gray-400">Clients by location</p>
                    </div>
               </div>

               {stats.clientsByLocation.length > 0 ? (
                    <div className="space-y-4">
                         {stats.clientsByLocation.map((location, index) => {
                              const percentage = (location.count / maxCount) * 100;
                              
                              return (
                                   <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                             <div className="flex items-center gap-2">
                                                  <MapPin className="w-4 h-4 text-gray-400" />
                                                  <span className="font-medium text-white">
                                                       {location.location}
                                                  </span>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                  <Users className="w-4 h-4 text-gray-400" />
                                                  <span className="text-sm font-semibold text-white">
                                                       {location.count}
                                                  </span>
                                             </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                             <div className="flex-1 bg-gray-800 rounded-full h-3">
                                                  <div 
                                                       className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-700"
                                                       style={{ width: `${percentage}%` }}
                                                  />
                                             </div>
                                             <span className="text-xs text-gray-500 w-12 text-right">
                                                  {((location.count / stats.totalClients) * 100).toFixed(1)}%
                                             </span>
                                        </div>
                                   </div>
                              );
                         })}
                    </div>
               ) : (
                    <div className="text-center py-12">
                         <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                         <p className="text-gray-500 font-medium">No location data available</p>
                         <p className="text-sm text-gray-400 mt-1">Client locations will appear here</p>
                    </div>
               )}

               {/* Summary */}
               {stats.clientsByLocation.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                         <p className="text-sm text-gray-400">
                              Showing top <span className="font-semibold text-white">{stats.clientsByLocation.length}</span> locations
                         </p>
                    </div>
               )}
          </div>
     );
}
