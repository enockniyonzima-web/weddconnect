import { Layers, BadgeCheck, Users, Wallet } from "lucide-react";
import { resolveRange } from "@/lib/admin/date-range";
import { fetchPlanStats } from "@/lib/admin/clients-report";
import { formatCount, formatRwf } from "@/lib/admin/format";
import { PageHeader, StatCard } from "@/components/admin/insights/StatCard";
import { DateRangeFilter } from "@/components/admin/insights/Filters";
import { SubscriptionFormBtn } from "@/components/forms/crm/SubscriptionForm";
import PlansBoard from "./SubscriptionsContainer";

export default async function SubscriptionsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     const search = await searchParams;
     const range = resolveRange(search, "all");
     const plans = await fetchPlanStats(range);
     const totals = plans.reduce((a, p) => ({ active: a.active + p.active, revenue: a.revenue + p.revenue, live: a.live + (p.isActive ? 1 : 0) }), { active: 0, revenue: 0, live: 0 });

     return (
          <div className="w-full space-y-6 pb-10">
               <PageHeader icon={<Layers size={24} />} title="Subscription plans" description="The plans clients can buy, how many people are on each, and how much each plan has earned.">
                    <div className="flex flex-wrap items-center gap-2">
                         <DateRangeFilter defaultPreset="all" label="Earnings period" />
                         <SubscriptionFormBtn showBtnName showBtnIcon btnSize="md" />
                    </div>
               </PageHeader>

               <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard title="Plans for sale" value={`${totals.live} of ${plans.length}`} icon={<BadgeCheck size={20} />} tone="blue" info="Plans switched on can be bought by clients. Switched-off plans are hidden from clients but existing subscribers keep them until they end." />
                    <StatCard title="Active subscribers" value={formatCount(totals.active)} icon={<Users size={20} />} tone="green" delay={0.05} href="/dashboard/admin/clients/active" info="Clients with a running (paid, not expired) plan today, across all plans." />
                    <StatCard title="Earned by plans" value={formatRwf(totals.revenue)} icon={<Wallet size={20} />} tone="teal" delay={0.1} sub={range.label} href={`/dashboard/admin/finance?${search.range ? `range=${search.range}` : search.from || search.to ? `from=${search.from ?? ""}&to=${search.to ?? ""}` : "range=all"}`} linkLabel="Finance details" info="Successful payments in the chosen period, credited to the plan each payment was for." />
               </div>

               <PlansBoard plans={plans} rangeLabel={range.label} />
          </div>
     );
}
