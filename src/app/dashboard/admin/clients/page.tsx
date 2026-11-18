import Link from "next/link";
import { Users, UserCheck, AlarmClock, Hourglass, CalendarX, UserX, UserPlus, BadgePlus, RefreshCcw, Wallet, Phone, ArrowRight, CalendarClock } from "lucide-react";
import { resolveRange, rangeParams } from "@/lib/admin/date-range";
import { fetchClientsOverview } from "@/lib/admin/clients-report";
import { CLIENT_STATUS_META, EXPIRING_SOON_DAYS } from "@/lib/admin/client-status";
import { formatRwf, formatCount, formatDate, relativeDays } from "@/lib/admin/format";
import { StatCard, Panel, PageHeader, EmptyState, TONES } from "@/components/admin/insights/StatCard";
import { DateRangeFilter } from "@/components/admin/insights/Filters";
import { TrendChart, DonutChart, BarList } from "@/components/admin/insights/Charts";

export default async function AdminClientsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     const search = await searchParams;
     const range = resolveRange(search, "30d");
     const o = await fetchClientsOverview(range);
     const rp = new URLSearchParams(rangeParams(range)).toString();
     const c = o.counts;
     const vs = range.previous ? "vs previous period" : undefined;
     const activeOnly = c.active - c.expiring;

     return (
          <div className="w-full space-y-6 pb-10">
               <PageHeader icon={<Users size={24} />} title="Clients overview" description={`Who your clients are, which plans they are on, and who needs attention. Period: ${range.label}.`}>
                    <DateRangeFilter defaultPreset="30d" />
               </PageHeader>

               {/* Right now */}
               <section className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Right now</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                         <StatCard title="Total clients" value={formatCount(c.all)} icon={<Users size={20} />} tone="blue" href="/dashboard/admin/clients/all" linkLabel="Open client list" sub={`${formatCount(c.none)} have never chosen a plan`} info="Every client account on the platform, whatever their plan status." />
                         <StatCard title="Active clients" value={formatCount(c.active)} icon={<UserCheck size={20} />} tone="green" delay={0.05} href={CLIENT_STATUS_META.active.href} sub={c.all ? `${((c.active / c.all) * 100).toFixed(0)}% of all clients` : undefined} info={CLIENT_STATUS_META.active.description} />
                         <StatCard title={`Ending in ${EXPIRING_SOON_DAYS} days`} value={formatCount(c.expiring)} icon={<AlarmClock size={20} />} tone="amber" delay={0.1} href={CLIENT_STATUS_META.expiring.href} linkLabel="Call to renew" sub="still active today" info={CLIENT_STATUS_META.expiring.description} />
                         <StatCard title="Awaiting payment" value={formatCount(c.pending)} icon={<Hourglass size={20} />} tone="purple" delay={0.15} href={CLIENT_STATUS_META.pending.href} linkLabel="Review requests" info={CLIENT_STATUS_META.pending.description} />
                         <StatCard title="Expired" value={formatCount(c.expired)} icon={<CalendarX size={20} />} tone="red" delay={0.2} href={CLIENT_STATUS_META.expired.href} linkLabel="See who to win back" info={CLIENT_STATUS_META.expired.description} />
                         <StatCard title="Cancelled / not started" value={formatCount(c.inactive)} icon={<UserX size={20} />} tone="gray" delay={0.25} href={CLIENT_STATUS_META.inactive.href} info={CLIENT_STATUS_META.inactive.description} />
                    </div>
               </section>

               {/* In the selected period */}
               <section className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{range.label}</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                         <StatCard title="New sign-ups" value={formatCount(o.newSignups)} icon={<UserPlus size={20} />} tone="teal" change={o.newSignupsChange} changeLabel={vs} href={`/dashboard/admin/clients/all?${rp}&dateField=joined`} info="Client accounts created in this period, whether or not they chose a plan." />
                         <StatCard title="New subscribers" value={formatCount(o.newSubscriptions)} icon={<BadgePlus size={20} />} tone="green" delay={0.05} change={o.newSubscriptionsChange} changeLabel={vs} href={`/dashboard/admin/clients/all?${rp}&dateField=start`} info="Clients who chose a plan for the first time in this period." />
                         <StatCard title="Renewals" value={formatCount(o.renewals)} icon={<RefreshCcw size={20} />} tone="blue" delay={0.1} href={`/dashboard/admin/finance/transactions?${rp}&group=paid`} linkLabel="See payments" info="Successful payments in this period from clients who were already subscribed before (any payment made more than a day after the client's first subscription)." />
                         <StatCard title="Plans that ended" value={formatCount(o.endedInPeriod)} icon={<CalendarClock size={20} />} tone="red" delay={0.15} href={`/dashboard/admin/clients/expired?${rp}&dateField=expiry`} info="Clients who are expired today and whose plan ended during this period. Clients who already renewed, or who have a payment waiting, are not counted. Clicking opens exactly these clients." />
                    </div>
               </section>

               <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <Panel className="xl:col-span-2" title="New subscribers over time" subtitle={`${range.label} · tap a bar for the exact number`} info="How many clients chose a plan for the first time, per day, week or month (Kigali time).">
                         <TrendChart data={o.series} countOnly countLabel="new subscribers" color="#2dd4bf" emptyText="No new subscribers in this period" />
                    </Panel>
                    <Panel title="Where clients are today" subtitle="Click a group to see the people" info="Every client is in exactly one group based on their plan right now. 'Ending soon' clients are still active." delay={0.05}>
                         <DonutChart
                              centerValue={formatCount(c.all)} centerLabel="clients"
                              data={[
                                   { label: "Active", value: activeOnly, color: TONES.green.bar, href: CLIENT_STATUS_META.active.href },
                                   { label: "Ending soon", value: c.expiring, color: TONES.amber.bar, href: CLIENT_STATUS_META.expiring.href },
                                   { label: "Awaiting payment", value: c.pending, color: TONES.purple.bar, href: CLIENT_STATUS_META.pending.href },
                                   { label: "Expired", value: c.expired, color: TONES.red.bar, href: CLIENT_STATUS_META.expired.href },
                                   { label: "Cancelled / not started", value: c.inactive, color: TONES.gray.bar, href: CLIENT_STATUS_META.inactive.href },
                                   { label: "No plan", value: c.none, color: "#475569", href: CLIENT_STATUS_META.none.href },
                              ].filter((d) => d.value > 0)}
                         />
                    </Panel>
               </div>

               <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <Panel title="Active clients by plan" subtitle="Which plans people are on right now" info="Clients with a running plan today, grouped by plan. Click a plan to see its clients." delay={0.05}>
                         <BarList color="#34d399" data={o.activeByPlan.map((p) => ({ label: p.name, value: p.count, sub: c.active ? `${((p.count / c.active) * 100).toFixed(0)}%` : undefined, href: `/dashboard/admin/clients/active?plan=${p.planId}` }))} empty="No active clients yet" />
                    </Panel>
                    <Panel
                         title="Plans ending in the next 14 days"
                         subtitle="Reach out before they lose access"
                         info="Active clients whose plan ends within 14 days, soonest first."
                         delay={0.1}
                         action={<Link href={CLIENT_STATUS_META.expiring.href} className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-200">See all <ArrowRight size={12} /></Link>}
                    >
                         {o.upcoming.length === 0 ? (
                              <EmptyState icon={<AlarmClock size={20} />} title="No plans ending soon" text="Nobody's plan ends in the next 14 days." />
                         ) : (
                              <ul className="flex flex-col divide-y divide-gray-800">
                                   {o.upcoming.map((u) => (
                                        <li key={u.id} className="flex items-center justify-between gap-3 py-2.5">
                                             <div className="min-w-0">
                                                  <Link href={`/dashboard/admin/clients/all?q=${encodeURIComponent(u.phone || u.name)}`} className="block truncate text-sm font-medium text-white hover:text-blue-200">{u.name}</Link>
                                                  <p className="text-xs text-gray-500">{u.plan} · ends {formatDate(u.expiryAt)}</p>
                                             </div>
                                             <div className="flex shrink-0 items-center gap-2">
                                                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-300">{relativeDays(u.expiryAt)}</span>
                                                  {u.phone && <a href={`tel:${u.phone}`} className="flex size-8 items-center justify-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" aria-label={`Call ${u.name}`}><Phone size={14} /></a>}
                                             </div>
                                        </li>
                                   ))}
                              </ul>
                         )}
                    </Panel>
               </div>

               <Link href={`/dashboard/admin/finance?${rp}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-800 bg-gradient-to-r from-emerald-950/40 to-gray-900 p-5 transition-colors hover:border-emerald-500/30">
                    <span className="flex items-center gap-3">
                         <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300"><Wallet size={20} /></span>
                         <span>
                              <span className="block text-sm text-gray-400">Money received from clients · {range.label}</span>
                              <span className="block text-xl font-bold text-white tabular-nums">{formatRwf(o.revenue)}</span>
                         </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-300">Finance details <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></span>
               </Link>
          </div>
     );
}
