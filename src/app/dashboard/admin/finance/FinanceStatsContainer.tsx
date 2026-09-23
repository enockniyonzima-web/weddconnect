import { fetchFinanceStats } from "@/server-actions/admin-finance";
import { formatPrice } from "@/util/stringFuncs";
import { DollarSign, Clock, TrendingUp, Calendar, Repeat, AlertTriangle, Receipt, Users } from "lucide-react";
import { FinanceStatCard, FinanceStatCardData } from "./FinanceStatCard";
import { RevenueTrendChart } from "./RevenueTrendChart";

export default async function FinanceStatsContainer() {
     const stats = await fetchFinanceStats();

     if (!stats) {
          return (
               <div className="w-full p-8 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-500 text-center">Unable to load financial statistics</p>
               </div>
          );
     }

     const primaryCards: FinanceStatCardData[] = [
          {
               title: "Total Revenue",
               value: `Rwf ${formatPrice(stats.totalRevenue)}`,
               subtitle: `${stats.totalPaidTransactions} paid transactions`,
               icon: DollarSign,
               bgGradient: "from-green-500 to-green-600",
          },
          {
               title: "Pending Amount",
               value: `Rwf ${formatPrice(stats.pendingAmount)}`,
               subtitle: `${stats.pendingCount} awaiting payment`,
               icon: Clock,
               bgGradient: "from-amber-500 to-amber-600",
          },
          {
               title: "This Month",
               value: `Rwf ${formatPrice(stats.revenueThisMonth)}`,
               subtitle: `vs Rwf ${formatPrice(stats.revenueLastMonth)} last month`,
               icon: Calendar,
               bgGradient: "from-blue-500 to-blue-600",
               growth: stats.monthOverMonthGrowth,
          },
          {
               title: "This Week",
               value: `Rwf ${formatPrice(stats.revenueThisWeek)}`,
               subtitle: `vs Rwf ${formatPrice(stats.revenueLastWeek)} last week`,
               icon: TrendingUp,
               bgGradient: "from-purple-500 to-purple-600",
               growth: stats.weekOverWeekGrowth,
          },
     ];

     const secondaryCards: FinanceStatCardData[] = [
          {
               title: "This Year",
               value: `Rwf ${formatPrice(stats.revenueThisYear)}`,
               subtitle: "Year to date",
               icon: Calendar,
               bgGradient: "from-indigo-500 to-indigo-600",
          },
          {
               title: "Monthly Recurring Revenue",
               value: `Rwf ${formatPrice(Math.round(stats.monthlyRecurringRevenue))}`,
               subtitle: "From active subscriptions",
               icon: Repeat,
               bgGradient: "from-teal-500 to-teal-600",
          },
          {
               title: "Avg. Transaction",
               value: `Rwf ${formatPrice(Math.round(stats.averageTransactionValue))}`,
               subtitle: "Per paid transaction",
               icon: Receipt,
               bgGradient: "from-cyan-500 to-cyan-600",
          },
          {
               title: "Failed / Expired",
               value: stats.failedOrExpiredCount.toLocaleString(),
               subtitle: `${stats.partiallyPaidCount} partially paid`,
               icon: AlertTriangle,
               bgGradient: "from-red-500 to-red-600",
          },
     ];

     const maxProviderAmount = Math.max(1, ...stats.revenueByProvider.map((p) => p.amount));
     const maxPlanAmount = Math.max(1, ...stats.revenueByPlan.map((p) => p.amount));

     return (
          <div className="w-full flex flex-col gap-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {primaryCards.map((stat) => (
                         <FinanceStatCard key={stat.title} stat={stat} />
                    ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {secondaryCards.map((stat) => (
                         <FinanceStatCard key={stat.title} stat={stat} />
                    ))}
               </div>

               <RevenueTrendChart trend={stats.monthlyRevenueTrend} />

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                         <h3 className="text-lg font-bold text-white mb-4">Revenue by Provider</h3>
                         <div className="space-y-3">
                              {stats.revenueByProvider.length === 0 && <p className="text-sm text-gray-500">No paid transactions yet</p>}
                              {stats.revenueByProvider.map((p) => {
                                   const pct = (p.amount / maxProviderAmount) * 100;
                                   return (
                                        <div key={p.provider}>
                                             <div className="flex justify-between text-sm mb-2">
                                                  <span className="font-medium text-gray-300">{p.provider === "IREMBO_PAY" ? "IremboPay" : "Manual"}</span>
                                                  <span className="font-bold text-white">Rwf {formatPrice(p.amount)} ({p.count})</span>
                                             </div>
                                             <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                             </div>
                                        </div>
                                   );
                              })}
                         </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                         <h3 className="text-lg font-bold text-white mb-4">Revenue by Plan</h3>
                         <div className="space-y-3">
                              {stats.revenueByPlan.length === 0 && <p className="text-sm text-gray-500">No paid transactions yet</p>}
                              {stats.revenueByPlan.map((p) => {
                                   const pct = (p.amount / maxPlanAmount) * 100;
                                   return (
                                        <div key={p.subscriptionName}>
                                             <div className="flex justify-between text-sm mb-2">
                                                  <span className="font-medium text-gray-300">{p.subscriptionName}</span>
                                                  <span className="font-bold text-white">Rwf {formatPrice(p.amount)} ({p.count})</span>
                                             </div>
                                             <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                             </div>
                                        </div>
                                   );
                              })}
                         </div>
                    </div>
               </div>

               <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <div className="flex items-center gap-2 mb-4">
                         <Users className="w-5 h-5 text-blue-400" />
                         <h3 className="text-lg font-bold text-white">Top Paying Clients</h3>
                    </div>
                    {stats.topPayingClients.length === 0 ? (
                         <p className="text-sm text-gray-500">No paid transactions yet</p>
                    ) : (
                         <div className="w-full overflow-x-auto">
                              <table className="w-full border-collapse">
                                   <thead>
                                        <tr className="bg-gray-800 text-left text-gray-300 text-xs">
                                             <th className="p-3">Client</th>
                                             <th className="p-3">Plan</th>
                                             <th className="p-3">Total Paid</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {stats.topPayingClients.map((c) => (
                                             <tr key={c.clientId} className="border-b border-gray-800 hover:bg-gray-800/50">
                                                  <td className="p-3 text-gray-300 text-sm">{c.name}</td>
                                                  <td className="p-3 text-gray-400 text-sm">{c.subscriptionName}</td>
                                                  <td className="p-3 text-white text-sm font-semibold">Rwf {formatPrice(c.amount)}</td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         </div>
                    )}
               </div>
          </div>
     );
}
