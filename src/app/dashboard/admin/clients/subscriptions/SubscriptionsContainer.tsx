"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Layers, Users, Clock, BadgeCheck, BadgeX, X, CheckCircle, Search, Wallet, ArrowRight, Phone } from "lucide-react";
import type { TPlanStats } from "@/lib/admin/clients-report";
import { formatRwf, formatCount, formatDate, relativeDays } from "@/lib/admin/format";
import { SubscriptionFormBtn } from "@/components/forms/crm/SubscriptionForm";
import { InfoTip } from "@/components/admin/insights/InfoTip";
import { EmptyState } from "@/components/admin/insights/StatCard";

const STATUS_FILTERS = [
     { value: "all", label: "All plans" },
     { value: "on", label: "For sale" },
     { value: "off", label: "Switched off" },
] as const;

function PlanDrawer({ plan, rangeLabel, onClose }: { plan: TPlanStats; rangeLabel: string; onClose: () => void }) {
     const [q, setQ] = useState("");
     const now = Date.now();
     const members = plan.members.filter((m) => !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.phone?.includes(q));

     return (
          <div className="fixed inset-0 z-50 flex justify-end">
               <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
               <motion.aside
                    initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-gray-800 bg-gray-950 shadow-2xl"
               >
                    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-800 bg-gray-950/95 px-5 py-4 backdrop-blur">
                         <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300"><Layers size={18} /></div>
                              <div>
                                   <h2 className="text-base font-bold text-white">{plan.name}</h2>
                                   <p className="text-xs text-gray-500">{formatRwf(plan.priceRwf)} · {plan.duration} {plan.durationUnit}{plan.duration === 1 ? "" : "s"}</p>
                              </div>
                         </div>
                         <button onClick={onClose} aria-label="Close" className="flex size-8 items-center justify-center rounded-lg border border-gray-800 bg-gray-900 text-gray-500 hover:text-white"><X size={15} /></button>
                    </div>

                    <div className="flex flex-col gap-5 p-5">
                         <div className="grid grid-cols-2 gap-3">
                              {[
                                   { label: "Active now", value: formatCount(plan.active), cls: "text-emerald-300", href: `/dashboard/admin/clients/active?plan=${plan.id}` },
                                   { label: "Expired", value: formatCount(plan.expired), cls: "text-rose-300", href: `/dashboard/admin/clients/expired?plan=${plan.id}` },
                                   { label: `Earned · ${rangeLabel}`, value: formatRwf(plan.revenue), cls: "text-white", href: `/dashboard/admin/finance/transactions?group=paid&plan=${plan.id}` },
                                   { label: "Payments", value: formatCount(plan.payments), cls: "text-white", href: `/dashboard/admin/finance/transactions?group=paid&plan=${plan.id}` },
                              ].map((s) => (
                                   <Link key={s.label} href={s.href} className="group rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700">
                                        <p className="text-xs text-gray-500">{s.label}</p>
                                        <p className={`mt-1 text-lg font-bold tabular-nums ${s.cls}`}>{s.value}</p>
                                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-gray-500 group-hover:text-gray-300">Open <ArrowRight size={10} /></span>
                                   </Link>
                              ))}
                         </div>

                         {plan.description && (
                              <div>
                                   <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Description</p>
                                   <p className="text-sm leading-relaxed text-gray-300">{plan.description}</p>
                              </div>
                         )}

                         {plan.benefits.length > 0 && (
                              <div>
                                   <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">What clients get</p>
                                   <ul className="flex flex-col gap-1.5">
                                        {plan.benefits.map((b, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={13} className="shrink-0 text-blue-400" />{b}</li>)}
                                   </ul>
                              </div>
                         )}

                         <div>
                              <div className="mb-2 flex items-center justify-between">
                                   <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Clients on this plan ({formatCount(plan.subscribers)})</p>
                                   {plan.subscribers > 100 && <Link href={`/dashboard/admin/clients/all?plan=${plan.id}`} className="text-xs text-blue-300 hover:text-blue-200">See all</Link>}
                              </div>
                              {plan.members.length > 6 && (
                                   <div className="relative mb-2">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a client" className="h-9 w-full rounded-lg border border-gray-800 bg-gray-900 pl-8 pr-3 text-sm text-gray-200 outline-none focus:border-blue-500" />
                                   </div>
                              )}
                              {members.length === 0 ? (
                                   <p className="py-3 text-xs text-gray-600">{plan.members.length ? "No match" : "No clients on this plan yet"}</p>
                              ) : (
                                   <ul className="flex flex-col divide-y divide-gray-800">
                                        {members.map((m) => {
                                             const active = m.expiryAt && new Date(m.expiryAt).getTime() > now;
                                             return (
                                                  <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                                                       <div className="min-w-0">
                                                            <Link href={`/dashboard/admin/clients/all?q=${encodeURIComponent(m.phone || m.name)}`} className="block truncate text-sm font-medium text-white hover:text-blue-200">{m.name}</Link>
                                                            <p className="text-xs text-gray-500">Since {formatDate(m.since)}{m.expiryAt ? ` · ${active ? "ends" : "ended"} ${formatDate(m.expiryAt)}` : ""}</p>
                                                       </div>
                                                       <div className="flex shrink-0 items-center gap-2">
                                                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${active ? "bg-emerald-500/10 text-emerald-300" : m.expiryAt ? "bg-rose-500/10 text-rose-300" : "bg-gray-700/40 text-gray-400"}`}>
                                                                 {active ? relativeDays(m.expiryAt!) : m.expiryAt ? "Expired" : "Not started"}
                                                            </span>
                                                            {m.phone && <a href={`tel:${m.phone}`} aria-label={`Call ${m.name}`} className="flex size-7 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-white"><Phone size={12} /></a>}
                                                       </div>
                                                  </li>
                                             );
                                        })}
                                   </ul>
                              )}
                         </div>

                         <div className="border-t border-gray-800 pt-3">
                              <SubscriptionFormBtn categoryId={plan.id} showBtnName showBtnIcon btnSize="md" />
                         </div>
                    </div>
               </motion.aside>
          </div>
     );
}

export default function PlansBoard({ plans, rangeLabel }: { plans: TPlanStats[]; rangeLabel: string }) {
     const [viewingId, setViewingId] = useState<number | null>(null);
     const [q, setQ] = useState("");
     const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]["value"]>("all");
     const viewing = plans.find((p) => p.id === viewingId) ?? null;
     const maxActive = Math.max(1, ...plans.map((p) => p.active));
     const topEarner = useMemo(() => plans.reduce<TPlanStats | null>((a, b) => (b.revenue > (a?.revenue ?? 0) ? b : a), null), [plans]);

     const shown = plans.filter((p) => (status === "all" || (status === "on" ? p.isActive : !p.isActive)) && (!q || p.name.toLowerCase().includes(q.toLowerCase())));

     return (
          <div className="flex flex-col gap-5">
               <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
                    <div className="relative min-w-[200px] flex-1">
                         <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                         <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plans" className="h-10 w-full rounded-xl border border-gray-700 bg-gray-900 pl-9 pr-3 text-sm text-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div className="flex gap-1.5">
                         {STATUS_FILTERS.map((s) => (
                              <button key={s.value} onClick={() => setStatus(s.value)} className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${status === s.value ? "text-white" : "border border-gray-800 bg-gray-900 text-gray-400 hover:text-white"}`}>
                                   {status === s.value && <motion.span layoutId="plan-filter" className="absolute inset-0 rounded-full bg-blue-600" transition={{ type: "spring", duration: 0.4 }} />}
                                   <span className="relative">{s.label}</span>
                              </button>
                         ))}
                    </div>
               </div>

               {shown.length === 0 ? (
                    <EmptyState icon={<Wallet size={20} />} title={plans.length ? "No plans match" : "No subscription plans yet"} text={plans.length ? "Try another search or filter." : "Create the first plan with the “Add” button above."} />
               ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                         {shown.map((p, i) => (
                              <motion.div
                                   key={p.id}
                                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                                   className="group relative flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-700 hover:shadow-xl hover:shadow-black/30"
                              >
                                   {topEarner?.id === p.id && (
                                        <span className="absolute -top-3 left-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-bold text-white shadow">Top earner</span>
                                   )}
                                   <div className="flex items-start justify-between gap-2">
                                        <div>
                                             <h3 className="text-lg font-bold text-white">{p.name}</h3>
                                             <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500"><Clock size={11} /> {p.duration} {p.durationUnit}{p.duration === 1 ? "" : "s"}</p>
                                        </div>
                                        <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${p.isActive ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-gray-700 bg-gray-800 text-gray-400"}`}>
                                             {p.isActive ? <BadgeCheck size={12} /> : <BadgeX size={12} />}{p.isActive ? "For sale" : "Switched off"}
                                        </span>
                                   </div>

                                   <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl font-bold tracking-tight text-white tabular-nums">{formatRwf(p.priceRwf)}</span>
                                        {p.currency === "USD" && (
                                             <InfoTip title="Price shown in Rwf" align="left">This plan is saved in USD ({p.price.toLocaleString()} USD). Clients are charged the Rwf amount shown, converted at the platform rate. Edit the plan and set its currency to RWF to remove the conversion.</InfoTip>
                                        )}
                                   </div>

                                   <div>
                                        <div className="mb-1.5 flex items-center justify-between text-xs">
                                             <span className="flex items-center gap-1 text-gray-400"><Users size={12} /> {formatCount(p.active)} active now</span>
                                             <span className="text-gray-500">{formatCount(p.subscribers)} ever</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                                             <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" initial={{ width: 0 }} animate={{ width: `${(p.active / maxActive) * 100}%` }} transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }} />
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-2 gap-2">
                                        <div className="rounded-xl bg-gray-950/60 px-3 py-2.5">
                                             <p className="flex items-center gap-1 text-[11px] text-gray-500">Earned <InfoTip title="Earned">Successful payments for this plan · {rangeLabel}.</InfoTip></p>
                                             <p className="text-sm font-semibold text-emerald-300 tabular-nums">{formatRwf(p.revenue)}</p>
                                        </div>
                                        <div className="rounded-xl bg-gray-950/60 px-3 py-2.5">
                                             <p className="text-[11px] text-gray-500">Expired / not started</p>
                                             <p className="text-sm font-semibold text-gray-200 tabular-nums">{formatCount(p.expired)} / {formatCount(p.notStarted)}</p>
                                        </div>
                                   </div>

                                   <div className="mt-auto flex items-center gap-2 border-t border-gray-800 pt-3">
                                        <button onClick={() => setViewingId(p.id)} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-blue-500">
                                             View clients & details <ArrowRight size={12} />
                                        </button>
                                        <SubscriptionFormBtn categoryId={p.id} showBtnName showBtnIcon btnSize="sm" />
                                   </div>
                              </motion.div>
                         ))}
                    </div>
               )}

               <AnimatePresence>{viewing && <PlanDrawer plan={viewing} rangeLabel={rangeLabel} onClose={() => setViewingId(null)} />}</AnimatePresence>
          </div>
     );
}
