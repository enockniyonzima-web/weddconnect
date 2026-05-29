"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubscriptions } from "@/server-actions/subscription.actions";
import { SAdminSubscriptionCard, TAdminSubscriptionCard } from "@/select-types/subscription";
import { SubscriptionFormBtn } from "@/components/forms/crm/SubscriptionForm";
import {
     Loader2, Wallet, Users, Clock, BadgeCheck, BadgeX, Zap,
     Eye, X, TrendingUp, Calendar, CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

function SubscriptionDrawer({ sub, onClose }: { sub: TAdminSubscriptionCard; onClose: () => void }) {
     const clientCount = sub._count.clientSubscriptions;
     const totalRevenue = sub.clientSubscriptions.reduce(
          (acc, cs) => acc + cs.transactions.reduce((a, t) => a + t.amount, 0), 0
     );

     return (
          <div className="fixed inset-0 z-50 flex justify-end">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
               <div className="relative w-full max-w-md h-full bg-gray-950 border-l border-gray-800 flex flex-col overflow-y-auto shadow-2xl">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-5 py-4 flex items-center justify-between gap-3">
                         <div className="flex items-center gap-3">
                              <div className="size-9 rounded-xl bg-blue-600/15 border border-blue-600/20 flex items-center justify-center shrink-0">
                                   <Wallet size={16} className="text-blue-400" />
                              </div>
                              <div>
                                   <h2 className="text-sm font-bold text-white">{sub.name}</h2>
                                   <p className="text-xs text-gray-500">{sub.duration} {sub.durationUnit}</p>
                              </div>
                         </div>
                         <button onClick={onClose} className="size-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                              <X size={15} />
                         </button>
                    </div>

                    <div className="flex flex-col gap-5 p-5">
                         {/* Stats */}
                         <div className="grid grid-cols-2 gap-3">
                              {[
                                   { label: "Subscribers", value: clientCount, icon: Users, color: "text-blue-400" },
                                   { label: "Revenue (GHS)", value: totalRevenue.toLocaleString(), icon: TrendingUp, color: "text-green-400" },
                                   { label: "Price", value: `${sub.price.toLocaleString()} ${sub.currency}`, icon: Wallet, color: "text-purple-400" },
                                   { label: "Duration", value: `${sub.duration} ${sub.durationUnit}`, icon: Clock, color: "text-orange-400" },
                              ].map(({ label, value, icon: Icon, color }) => (
                                   <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-1.5">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500"><Icon size={11} className={color} />{label}</div>
                                        <p className="text-sm font-bold text-white">{value}</p>
                                   </div>
                              ))}
                         </div>

                         {/* Status & active */}
                         <div className="flex items-center gap-2">
                              <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${sub.isActive ? "bg-green-950/50 text-green-400 border-green-800/40" : "bg-gray-800 text-gray-500 border-gray-700"}`}>
                                   {sub.isActive ? <BadgeCheck size={11} /> : <BadgeX size={11} />}
                                   {sub.isActive ? "Active" : "Inactive"}
                              </span>
                         </div>

                         {/* Description */}
                         <div className="flex flex-col gap-1.5">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</p>
                              <p className="text-sm text-gray-300 leading-relaxed">{sub.description}</p>
                         </div>

                         {/* Benefits */}
                         {sub.benefits.length > 0 && (
                              <div className="flex flex-col gap-2">
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Benefits</p>
                                   <ul className="flex flex-col gap-1.5">
                                        {sub.benefits.map((b, i) => (
                                             <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                                  <CheckCircle size={12} className="text-blue-500 shrink-0" />{b}
                                             </li>
                                        ))}
                                   </ul>
                              </div>
                         )}

                         {/* Clients */}
                         <div className="flex flex-col gap-2">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subscribers ({clientCount})</p>
                              {sub.clientSubscriptions.length === 0 ? (
                                   <p className="text-xs text-gray-600 py-2">No subscribers yet</p>
                              ) : (
                                   <div className="flex flex-col divide-y divide-gray-800">
                                        {sub.clientSubscriptions.map((cs) => {
                                             const clientRevenue = cs.transactions.reduce((a, t) => a + t.amount, 0);
                                             return (
                                                  <div key={cs.id} className="flex items-center justify-between py-2.5 gap-3">
                                                       <div className="min-w-0">
                                                            <p className="text-xs font-medium text-white truncate">{cs.client.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                 <span className="text-xs text-gray-600 flex items-center gap-0.5"><Calendar size={9} />{format(new Date(cs.createdAt), "MMM d, yyyy")}</span>
                                                                 {cs.expiryAt && <span className="text-xs text-gray-600">· exp {format(new Date(cs.expiryAt), "MMM d")}</span>}
                                                            </div>
                                                       </div>
                                                       <span className="text-xs font-semibold text-green-400 shrink-0">GHS {clientRevenue.toLocaleString()}</span>
                                                  </div>
                                             );
                                        })}
                                   </div>
                              )}
                         </div>

                         {/* Edit button */}
                         <div className="pt-2 border-t border-gray-800">
                              <SubscriptionFormBtn categoryId={sub.id} showBtnName showBtnIcon btnSize="md" />
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default function SubscriptionsContainer() {
     const [viewing, setViewing] = useState<TAdminSubscriptionCard | null>(null);

     const { data: subscriptions = [], isLoading } = useQuery({
          queryKey: ["admin-subscriptions-container"],
          queryFn: () => fetchSubscriptions(SAdminSubscriptionCard),
     });

     return (
          <div className="w-full flex flex-col gap-6 px-4 sm:px-6 py-4">
               {/* Top bar */}
               <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">{subscriptions.length} plan{subscriptions.length !== 1 ? "s" : ""} available</p>
                    <SubscriptionFormBtn showBtnName showBtnIcon btnSize="md" />
               </div>

               {/* Grid */}
               {isLoading ? (
                    <div className="flex justify-center py-20">
                         <Loader2 size={24} className="animate-spin text-blue-500" />
                    </div>
               ) : subscriptions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
                         <Wallet size={36} strokeWidth={1} />
                         <p className="text-sm">No subscription plans yet</p>
                    </div>
               ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                         {subscriptions.map((sub, i) => {
                              const clientCount = sub._count.clientSubscriptions;
                              const revenue = sub.clientSubscriptions.reduce(
                                   (acc, cs) => acc + cs.transactions.reduce((a, t) => a + t.amount, 0), 0
                              );
                              return (
                                   <div key={sub.id} className="relative bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-gray-700 transition-colors">
                                        {i === 1 && (
                                             <span className="absolute -top-3 left-5 flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white">
                                                  <Zap size={10} /> Popular
                                             </span>
                                        )}

                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-2">
                                             <div className="size-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center shrink-0">
                                                  <Wallet size={18} className="text-blue-400" />
                                             </div>
                                             <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${sub.isActive ? "bg-green-950/50 text-green-400 border border-green-800/40" : "bg-gray-800 text-gray-500 border border-gray-700"}`}>
                                                  {sub.isActive ? <BadgeCheck size={11} /> : <BadgeX size={11} />}
                                                  {sub.isActive ? "Active" : "Inactive"}
                                             </div>
                                        </div>

                                        {/* Name & description */}
                                        <div>
                                             <h3 className="text-base font-bold text-white">{sub.name}</h3>
                                             <p className="text-xs text-gray-500 mt-1 line-clamp-2">{sub.description}</p>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-1">
                                             <span className="text-2xl font-bold text-white">{sub.price.toLocaleString()}</span>
                                             <span className="text-xs text-gray-500">{sub.currency}</span>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-2">
                                             <div className="bg-gray-950 rounded-xl px-3 py-2 flex flex-col gap-0.5">
                                                  <div className="flex items-center gap-1 text-xs text-gray-600"><Clock size={10} /> Duration</div>
                                                  <p className="text-xs font-semibold text-gray-300">{sub.duration} {sub.durationUnit}</p>
                                             </div>
                                             <div className="bg-gray-950 rounded-xl px-3 py-2 flex flex-col gap-0.5">
                                                  <div className="flex items-center gap-1 text-xs text-gray-600"><Users size={10} /> Clients</div>
                                                  <p className="text-xs font-semibold text-gray-300">{clientCount}</p>
                                             </div>
                                             <div className="bg-gray-950 rounded-xl px-3 py-2 flex flex-col gap-0.5">
                                                  <div className="flex items-center gap-1 text-xs text-gray-600"><TrendingUp size={10} /> Revenue</div>
                                                  <p className="text-xs font-semibold text-green-400">{revenue.toLocaleString()}</p>
                                             </div>
                                        </div>

                                        {/* Benefits preview */}
                                        {sub.benefits && sub.benefits.length > 0 && (
                                             <ul className="flex flex-col gap-1">
                                                  {sub.benefits.slice(0, 3).map((b, j) => (
                                                       <li key={j} className="flex items-center gap-1.5 text-xs text-gray-400">
                                                            <span className="size-1 rounded-full bg-blue-500 shrink-0" />{b}
                                                       </li>
                                                  ))}
                                                  {sub.benefits.length > 3 && (
                                                       <li className="text-xs text-gray-600">+{sub.benefits.length - 3} more</li>
                                                  )}
                                             </ul>
                                        )}

                                        {/* Actions */}
                                        <div className="pt-1 border-t border-gray-800 flex items-center gap-2">
                                             <button
                                                  onClick={() => setViewing(sub)}
                                                  className="flex items-center gap-1.5 h-8 px-3 text-xs rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                                             >
                                                  <Eye size={13} /> View
                                             </button>
                                             <SubscriptionFormBtn categoryId={sub.id} showBtnName showBtnIcon btnSize="sm" />
                                        </div>
                                   </div>
                              );
                         })}
                    </div>
               )}

               {/* Drawer */}
               {viewing && <SubscriptionDrawer sub={viewing} onClose={() => setViewing(null)} />}
          </div>
     );
}
