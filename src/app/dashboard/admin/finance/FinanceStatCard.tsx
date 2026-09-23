import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

export interface FinanceStatCardData {
     title: string;
     value: string;
     subtitle: string;
     icon: LucideIcon;
     bgGradient: string;
     growth?: number; // percentage — omit to hide the trend pill
}

export const FinanceStatCard = ({ stat }: { stat: FinanceStatCardData }) => {
     const hasGrowth = typeof stat.growth === "number" && Number.isFinite(stat.growth);
     const isPositive = hasGrowth && (stat.growth as number) >= 0;

     return (
          <div className="relative bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 group">
               <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
               <div className="p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                         <div className={`p-3 bg-gradient-to-br ${stat.bgGradient} rounded-lg shadow-lg`}>
                              <stat.icon className="w-6 h-6 text-white" />
                         </div>
                         {hasGrowth && (
                              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
                                   {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                   {isPositive ? "+" : ""}{(stat.growth as number).toFixed(1)}%
                              </span>
                         )}
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
               </div>
          </div>
     );
};
