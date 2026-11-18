import Link from "next/link";
import {
     LayoutDashboard, Wallet, UserCheck, Repeat, Hourglass, Store, FileText, Star, Newspaper,
     AlarmClock, XCircle, ClipboardCheck, ArrowRight, CheckCircle2, UserPlus, MessageSquare, Heart, Activity,
} from "lucide-react";
import { fetchDashboardReport } from "@/lib/admin/dashboard-report";
import { CLIENT_STATUS_META } from "@/lib/admin/client-status";
import { formatRwf, formatCount, formatDateTime } from "@/lib/admin/format";
import { StatCard, Panel, PageHeader, EmptyState, TONES } from "@/components/admin/insights/StatCard";
import { TrendChart, DonutChart, BarList } from "@/components/admin/insights/Charts";
import { Reveal } from "@/components/admin/insights/Reveal";

const FIN = "/dashboard/admin/finance";
const TX = "/dashboard/admin/finance/transactions";

export default async function AdminPage() {
     const d = await fetchDashboardReport();
     const { month, year, counts: c } = d;
     const activeOnly = c.active - c.expiring;

     const attention = [
          { label: "Payment requests to review", count: c.pending, href: CLIENT_STATUS_META.pending.href, icon: <Hourglass size={16} />, tone: "purple" as const, hint: "Approve or reject so clients get access" },
          { label: "Plans ending in 7 days", count: c.expiring, href: CLIENT_STATUS_META.expiring.href, icon: <AlarmClock size={16} />, tone: "amber" as const, hint: "Remind them to renew" },
          { label: "Posts waiting for approval", count: d.posts.pending, href: "/dashboard/admin/posts", icon: <ClipboardCheck size={16} />, tone: "blue" as const, hint: "Review before they go live" },
          { label: "Failed payments this week", count: d.failedThisWeek, href: `${TX}?range=7d&group=failed`, icon: <XCircle size={16} />, tone: "red" as const, hint: "Clients who may need help paying" },
     ];
     const openItems = attention.filter((a) => a.count > 0);

     return (
          <div className="w-full min-h-screen bg-gray-950">
               <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 pb-10 md:p-6 lg:p-8">
                    <PageHeader
                         icon={<LayoutDashboard size={24} />}
                         title="Platform overview"
                         description="How WeddConnect is doing today: money, clients, vendors and content. All numbers are live from the database, and amounts are in Rwf."
                    >
                         <div className="rounded-2xl border border-gray-800 bg-gray-950/50 px-5 py-3">
                              <p className="text-xs text-gray-500">Updated</p>
                              <p className="text-sm font-semibold text-white">{formatDateTime(new Date())}</p>
                         </div>
                    </PageHeader>

                    {/* Business */}
                    <section className="space-y-3">
                         <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Business</h2>
                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                              <StatCard title="Money received this month" value={formatRwf(month.revenue)} icon={<Wallet size={20} />} tone="green" change={month.previous?.revenueChange} changeLabel="vs same days last month" href={`${FIN}?range=month`} linkLabel="Finance details" info={<>Successful payments since the 1st of this month (Kigali time). The percentage compares with the same number of days just before ({month.range.previous?.label}). Pending and failed payments are not included.</>} />
                              <StatCard title="Active subscribers" value={formatCount(c.active)} icon={<UserCheck size={20} />} tone="teal" delay={0.05} href={CLIENT_STATUS_META.active.href} sub={c.all ? `${((c.active / c.all) * 100).toFixed(0)}% of ${formatCount(c.all)} clients` : undefined} info={CLIENT_STATUS_META.active.description} />
                              <StatCard title="Monthly recurring revenue" value={formatRwf(month.monthlyRecurringRevenue)} icon={<Repeat size={20} />} tone="blue" delay={0.1} href={FIN} sub="estimated per month" info="An estimate of monthly income from the plans running today: each active plan's price spread over its length (a 3-month plan at Rwf 30,000 counts as Rwf 10,000 a month)." />
                              <StatCard title="Waiting to be paid" value={formatRwf(month.outstandingPendingAmount)} icon={<Hourglass size={20} />} tone="amber" delay={0.15} href={`${TX}?group=pending`} linkLabel="Follow up" sub={`${formatCount(month.outstandingPendingCount)} payments`} info="Payments clients have started but that are not confirmed yet, across all dates. This money has not been received." />
                         </div>
                    </section>

                    {/* Marketplace */}
                    <section className="space-y-3">
                         <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Marketplace & content</h2>
                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                              <StatCard title="Active vendors" value={`${formatCount(d.vendors.active)}`} icon={<Store size={20} />} tone="purple" href="/dashboard/admin/posts/vendors" sub={`of ${formatCount(d.vendors.total)} vendors`} info="Vendors switched on and allowed to appear on the platform, out of all vendor accounts." />
                              <StatCard title="Live posts" value={formatCount(d.posts.live)} icon={<FileText size={20} />} tone="blue" delay={0.05} href="/dashboard/admin/posts" sub={`${formatCount(d.posts.pending)} waiting · ${formatCount(d.posts.total)} total`} info="Vendor service posts that are published and visible to visitors. 'Waiting' posts were submitted but not approved yet." />
                              <StatCard title="Average rating" value={d.reviews.avg ? `${d.reviews.avg.toFixed(1)} / 5` : "—"} icon={<Star size={20} />} tone="amber" delay={0.1} sub={`${formatCount(d.reviews.count)} reviews · ${formatCount(d.likes)} likes`} info="Average star rating across all reviews clients left on vendor posts. Shows — until the first review arrives." />
                              <StatCard title="Published articles" value={formatCount(d.blog.published)} icon={<Newspaper size={20} />} tone="teal" delay={0.15} href="/dashboard/admin/blog" sub={`${formatCount(d.blog.views)} views · ${formatCount(d.blog.drafts)} drafts`} info="Blog articles visitors can read, with the total number of times they were viewed." />
                         </div>
                    </section>

                    {/* Needs attention + client mix */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                         <Panel title="Needs your attention" subtitle="Things waiting on an admin" info="Items that need action. Each row opens the exact list." className="xl:col-span-1">
                              {openItems.length === 0 ? (
                                   <EmptyState icon={<CheckCircle2 size={20} />} title="All clear" text="Nothing is waiting on you right now." />
                              ) : (
                                   <ul className="flex flex-col gap-2">
                                        {attention.map((a) => (
                                             <li key={a.label}>
                                                  <Link href={a.href} className={`group flex items-center gap-3 rounded-xl border p-3 transition-colors ${a.count ? "border-gray-800 bg-gray-950/40 hover:border-gray-700 hover:bg-gray-800/40" : "border-transparent opacity-50"}`}>
                                                       <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${TONES[a.tone].icon}`}>{a.icon}</span>
                                                       <span className="min-w-0 flex-1">
                                                            <span className="block text-sm font-medium text-white">{a.label}</span>
                                                            <span className="block text-xs text-gray-500">{a.count ? a.hint : "Nothing waiting"}</span>
                                                       </span>
                                                       <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold tabular-nums ${a.count ? TONES[a.tone].soft + " border" : "text-gray-600"}`}>{a.count}</span>
                                                       <ArrowRight size={14} className="text-gray-600 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-300" />
                                                  </Link>
                                             </li>
                                        ))}
                                   </ul>
                              )}
                         </Panel>
                         <Panel className="xl:col-span-2" title="Money received · last 12 months" subtitle={`${formatRwf(year.revenue)} in total · ${formatCount(year.paidCount)} payments · tap a bar for details`} info="Successful payments per month for the last 12 months (Kigali time)." delay={0.05}
                              action={<Link href={`${FIN}?range=year`} className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300 hover:text-emerald-200">Finance <ArrowRight size={12} /></Link>}>
                              <TrendChart data={year.series} color="#34d399" height={220} />
                         </Panel>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                         <Panel title="Clients today" subtitle="Click a group to see the people" info="Every client is in exactly one group based on their plan right now." delay={0.05}>
                              <DonutChart
                                   centerValue={formatCount(c.all)} centerLabel="clients"
                                   data={[
                                        { label: "Active", value: activeOnly, color: TONES.green.bar, href: CLIENT_STATUS_META.active.href },
                                        { label: "Ending soon", value: c.expiring, color: TONES.amber.bar, href: CLIENT_STATUS_META.expiring.href },
                                        { label: "Awaiting payment", value: c.pending, color: TONES.purple.bar, href: CLIENT_STATUS_META.pending.href },
                                        { label: "Expired", value: c.expired, color: TONES.red.bar, href: CLIENT_STATUS_META.expired.href },
                                        { label: "Cancelled / not started", value: c.inactive, color: TONES.gray.bar, href: CLIENT_STATUS_META.inactive.href },
                                        { label: "No plan", value: c.none, color: "#475569", href: CLIENT_STATUS_META.none.href },
                                   ].filter((x) => x.value > 0)}
                              />
                         </Panel>
                         <Panel title="Posts by category" subtitle="Where vendor services are listed" info="Number of vendor posts (all statuses) in each category." delay={0.1}>
                              <BarList color="#a78bfa" data={d.categories.map((cat) => ({ label: cat.name, value: cat.posts }))} empty="No categories yet" />
                         </Panel>
                         <Panel title="Most popular posts" subtitle="Ranked by likes, then reviews" info="Live vendor posts that visitors liked and reviewed the most." delay={0.15}>
                              {d.topPosts.length === 0 ? (
                                   <EmptyState icon={<Heart size={20} />} title="No posts yet" />
                              ) : (
                                   <ol className="flex flex-col divide-y divide-gray-800">
                                        {d.topPosts.map((p, i) => (
                                             <li key={p.id} className="flex items-center gap-3 py-2.5">
                                                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-xs font-bold text-gray-300">{i + 1}</span>
                                                  <span className="min-w-0 flex-1">
                                                       <span className="block truncate text-sm font-medium text-white">{p.title}</span>
                                                       <span className="block truncate text-xs text-gray-500">{p.vendor}</span>
                                                  </span>
                                                  <span className="flex shrink-0 items-center gap-2 text-xs text-gray-400">
                                                       <span className="inline-flex items-center gap-1"><Heart size={12} className="text-rose-300" />{p.likes}</span>
                                                       <span className="inline-flex items-center gap-1"><MessageSquare size={12} className="text-blue-300" />{p.reviews}</span>
                                                  </span>
                                             </li>
                                        ))}
                                   </ol>
                              )}
                         </Panel>
                    </div>

                    <Panel title="Latest activity" subtitle="Newest payments, sign-ups and reviews" info="The most recent successful payments, client sign-ups and reviews, newest first." delay={0.1}>
                         {d.activity.length === 0 ? (
                              <EmptyState icon={<Activity size={20} />} title="No activity yet" />
                         ) : (
                              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                   {d.activity.map((a, i) => {
                                        const meta = a.kind === "payment"
                                             ? { icon: <Wallet size={15} />, tone: TONES.green, extra: formatRwf(a.detail as number) }
                                             : a.kind === "signup"
                                                  ? { icon: <UserPlus size={15} />, tone: TONES.blue, extra: "New client" }
                                                  : { icon: <Star size={15} />, tone: TONES.amber, extra: `${a.detail}★` };
                                        return (
                                             <Reveal key={a.id} delay={Math.min(i * 0.03, 0.25)}>
                                                  <Link href={a.href} className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950/40 p-3 transition-colors hover:border-gray-700 hover:bg-gray-800/40">
                                                       <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${meta.tone.icon}`}>{meta.icon}</span>
                                                       <span className="min-w-0 flex-1">
                                                            <span className="block truncate text-sm text-white">{a.title}</span>
                                                            <span className="block text-xs text-gray-500">{formatDateTime(a.at)}</span>
                                                       </span>
                                                       <span className={`shrink-0 text-sm font-semibold tabular-nums ${meta.tone.text}`}>{meta.extra}</span>
                                                  </Link>
                                             </Reveal>
                                        );
                                   })}
                              </ul>
                         )}
                    </Panel>
               </div>
          </div>
     );
}
