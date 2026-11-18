import Link from "next/link";
import { Wallet, CheckCircle2, Receipt, Users, Clock, XCircle, Percent, Repeat, ArrowRight, Trophy, Sparkles } from "lucide-react";
import { resolveRange, rangeParams } from "@/lib/admin/date-range";
import { fetchFinanceReport } from "@/lib/admin/finance-report";
import { formatRwf, formatCount } from "@/lib/admin/format";
import { StatCard, Panel, PageHeader, EmptyState } from "@/components/admin/insights/StatCard";
import { DateRangeFilter } from "@/components/admin/insights/Filters";
import { TrendChart, DonutChart, BarList } from "@/components/admin/insights/Charts";
import { InfoTip } from "@/components/admin/insights/InfoTip";

const TX_PATH = "/dashboard/admin/finance/transactions";
const GROUP_COLORS: Record<string, string> = { paid: "#34d399", pending: "#60a5fa", failed: "#fb7185", partial: "#fbbf24", other: "#9ca3af" };
const GRANULARITY_LABEL = { day: "per day", week: "per week", month: "per month" } as const;

export default async function AdminFinancePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     const search = await searchParams;
     const range = resolveRange(search, "30d");
     const r = await fetchFinanceReport(range);
     const rp = rangeParams(range);
     const txHref = (extra: Record<string, string> = {}) => `${TX_PATH}?${new URLSearchParams({ ...rp, ...extra }).toString()}`;
     const vsLabel = range.previous ? "vs previous period" : undefined;

     return (
          <div className="w-full space-y-6 pb-10">
               <PageHeader
                    icon={<Wallet size={24} />}
                    title="Finance overview"
                    description={`Money received from subscriptions, in Rwandan francs (Rwf). Showing: ${range.label}.`}
               >
                    <div className="flex flex-wrap items-center gap-2">
                         <DateRangeFilter defaultPreset="30d" />
                         <Link href={txHref()} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
                              All transactions <ArrowRight size={14} />
                         </Link>
                    </div>
               </PageHeader>

               {/* Headline numbers for the selected period */}
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                         title="Money received" value={formatRwf(r.revenue)} icon={<Wallet size={20} />} tone="green"
                         change={r.previous?.revenueChange} changeLabel={vsLabel} href={txHref({ group: "paid" })} linkLabel="See these payments"
                         info={<>Total of every <b>successful</b> payment made in this period (IremboPay payments confirmed as paid, plus manual payments approved by an admin). Pending, failed and cancelled payments are <b>not</b> included.{range.previous && <> The percentage compares with the same number of days just before ({range.previous.label}): {formatRwf(r.previous?.revenue)}.</>}</>}
                    />
                    <StatCard
                         title="Successful payments" value={formatCount(r.paidCount)} icon={<CheckCircle2 size={20} />} tone="teal" delay={0.05}
                         change={r.previous?.paidCountChange} changeLabel={vsLabel} href={txHref({ group: "paid" })} linkLabel="See these payments"
                         info="How many payments went through successfully in this period. One client renewing twice counts as two payments."
                    />
                    <StatCard
                         title="Average payment" value={formatRwf(r.averagePayment)} icon={<Receipt size={20} />} tone="blue" delay={0.1}
                         sub={`${formatCount(r.paidCount)} payments`}
                         info="Money received divided by the number of successful payments in this period. It shows what a typical client pays each time."
                    />
                    <StatCard
                         title="Paying clients" value={formatCount(r.payingClients)} icon={<Users size={20} />} tone="purple" delay={0.15}
                         sub="made at least one payment" href={txHref({ group: "paid" })} linkLabel="See who paid"
                         info="Number of different clients who paid at least once in this period. A client who paid several times is counted once."
                    />
                    <StatCard
                         title="Awaiting payment" value={formatRwf(r.pendingAmount)} icon={<Clock size={20} />} tone="amber" delay={0.2}
                         sub={`${formatCount(r.pendingCount)} started in this period`} href={txHref({ group: "pending" })} linkLabel="Follow up"
                         info={<>Payments that clients <b>started</b> in this period but that are not confirmed yet (unpaid IremboPay invoices or manual payment requests waiting for an admin). This money has <b>not</b> been received. Across all dates, {formatCount(r.outstandingPendingCount)} payments worth {formatRwf(r.outstandingPendingAmount)} are still waiting.</>}
                    />
                    <StatCard
                         title="Failed or cancelled" value={formatCount(r.failedCount)} icon={<XCircle size={20} />} tone="red" delay={0.25}
                         sub="payments" href={txHref({ group: "failed" })} linkLabel="See which ones"
                         info="Payments in this period that did not go through: failed, expired, cancelled (for example an IremboPay invoice left unpaid for over 24 hours) or rejected by an admin."
                    />
                    <StatCard
                         title="Payment success rate" value={r.successRate === null ? "—" : `${r.successRate.toFixed(0)}%`} icon={<Percent size={20} />} tone="teal" delay={0.3}
                         sub={r.successRate === null ? "no finished payments yet" : `${r.paidCount} of ${r.paidCount + r.failedCount} finished payments`}
                         info="Out of the payments that have finished (successful + failed/cancelled), how many succeeded. Payments still waiting are left out because they have not finished yet."
                    />
                    <StatCard
                         title="Monthly recurring revenue" value={formatRwf(r.monthlyRecurringRevenue)} icon={<Repeat size={20} />} tone="blue" delay={0.35}
                         sub={`${formatCount(r.activeSubscribers)} active subscribers today`} href="/dashboard/admin/clients/active" linkLabel="See active clients"
                         info="An estimate of how much the platform earns per month from the plans running today. Each active plan's price is spread over its length (e.g. a 3-month plan at Rwf 30,000 counts as Rwf 10,000 per month). This number is for today and does not change with the period selected."
                    />
               </div>

               {/* Trend */}
               <Panel
                    title="Money received over time"
                    subtitle={`${range.label} · ${GRANULARITY_LABEL[r.granularity]} · tap a bar to see its exact amount`}
                    info="Each bar is the total of successful payments for that day, week or month. The line shows the overall direction. Days are counted in Kigali time."
                    action={r.bestBucket && (
                         <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                              <Sparkles size={14} /> Best {r.granularity}: <b>{r.bestBucket.label}</b> · {formatRwf(r.bestBucket.revenue)}
                         </div>
                    )}
               >
                    <TrendChart data={r.series} color="#34d399" />
               </Panel>

               <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <Panel title="Payments by result" subtitle="Every payment started in this period" info="All payments created in this period, grouped by what happened to them. Click a row to see those payments." delay={0.05}>
                         <DonutChart
                              centerValue={formatCount(r.totalAttempts)} centerLabel="payments"
                              data={r.byStatus.map((s) => ({ label: s.label, value: s.count, color: GROUP_COLORS[s.group], sub: formatRwf(s.amount), href: s.group !== "other" ? txHref({ group: s.group }) : undefined }))}
                         />
                         {r.partialCount > 0 && <p className="mt-4 text-xs text-gray-500">Partially paid payments are not counted as money received until fully paid.</p>}
                    </Panel>
                    <Panel title="Money received by plan" subtitle="Which subscription plans bring in the money" info="Successful payments grouped by the plan the client paid for. If a client switched plans, each payment counts for the plan it was made for." delay={0.1}>
                         <BarList money color="#a78bfa" data={r.byPlan.map((p) => ({ label: p.name, value: p.amount, sub: `${p.count}×`, href: p.planId ? txHref({ group: "paid", plan: String(p.planId) }) : undefined }))} />
                    </Panel>
                    <Panel title="Money received by method" subtitle="How clients paid" info="Successful payments grouped by payment channel: IremboPay (with mobile money / card where IremboPay reports it) or manual payments recorded by an admin." delay={0.15}>
                         <BarList money color="#60a5fa" data={r.byMethod.map((m) => ({ label: m.name, value: m.amount, sub: `${m.count}×` }))} />
                    </Panel>
               </div>

               <Panel
                    title="Top paying clients"
                    subtitle={`Clients who paid the most · ${range.label}`}
                    info="Clients ranked by the total of their successful payments in this period. Click a client to see their payments."
                    delay={0.1}
               >
                    {r.topClients.length === 0 ? (
                         <EmptyState icon={<Trophy size={20} />} title="No payments in this period" text="Try a longer period using the date selector at the top." />
                    ) : (
                         <ol className="grid grid-cols-1 gap-2 md:grid-cols-2">
                              {r.topClients.map((c, i) => (
                                   <li key={c.clientId}>
                                        <Link href={txHref({ group: "paid", client: String(c.clientId) })} className="group flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950/40 p-3 transition-colors hover:border-gray-700 hover:bg-gray-800/40">
                                             <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${i === 0 ? "bg-amber-400/20 text-amber-300" : i === 1 ? "bg-gray-300/15 text-gray-200" : i === 2 ? "bg-orange-500/15 text-orange-300" : "bg-gray-800 text-gray-400"}`}>{i + 1}</span>
                                             <span className="min-w-0 flex-1">
                                                  <span className="block truncate text-sm font-medium text-white">{c.name}</span>
                                                  <span className="text-xs text-gray-500">{c.count} payment{c.count === 1 ? "" : "s"}</span>
                                             </span>
                                             <span className="text-sm font-semibold text-emerald-300 tabular-nums">{formatRwf(c.amount)}</span>
                                             <ArrowRight size={14} className="text-gray-600 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-300" />
                                        </Link>
                                   </li>
                              ))}
                         </ol>
                    )}
               </Panel>

               <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <InfoTip title="How these numbers are calculated" align="left">
                         Every number is calculated live from the payment records each time you open this page. A payment belongs to the day it was started (Kigali time). All amounts are in Rwandan francs.
                    </InfoTip>
                    Figures are calculated live from payment records · amounts in Rwf · days in Kigali time.
               </p>
          </div>
     );
}
