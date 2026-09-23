import { IFinanceStats } from "@/common/interfaces";
import { formatPrice } from "@/util/stringFuncs";
import { BarChart3 } from "lucide-react";

export const RevenueTrendChart = ({ trend }: { trend: IFinanceStats["monthlyRevenueTrend"] }) => {
     const maxValue = Math.max(1, ...trend.map((t) => t.amount));

     return (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
               <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <div>
                         <h3 className="text-lg font-bold text-white">Revenue Trend</h3>
                         <p className="text-xs text-gray-500">Last 12 months, paid transactions</p>
                    </div>
               </div>
               <div className="flex items-end gap-2 h-48">
                    {trend.map((point, i) => {
                         const pct = (point.amount / maxValue) * 100;
                         return (
                              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group h-full">
                                   <div className="relative w-full flex items-end justify-center h-full">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                             Rwf {formatPrice(point.amount)}
                                        </div>
                                        <div
                                             className="w-full max-w-[24px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-500 hover:to-blue-300 transition-colors"
                                             style={{ height: `${Math.max(pct, 2)}%` }}
                                        />
                                   </div>
                                   <span className="text-[10px] text-gray-500 whitespace-nowrap -rotate-45 md:rotate-0 origin-top-left md:text-center">
                                        {point.month.split(" ")[0]}
                                   </span>
                              </div>
                         );
                    })}
               </div>
          </div>
     );
};
