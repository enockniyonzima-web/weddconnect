import Link from "next/link";
import { Users, UserCheck, AlarmClock, Hourglass, CalendarX, Ban, UserX } from "lucide-react";
import { ClientStatus, CLIENT_STATUS_META } from "@/lib/admin/client-status";
import { fetchClientDirectory, fetchStatusCounts, fetchPlanOptions, CLIENT_SORTS, DATE_FIELDS, STATUS_ORDER } from "@/lib/admin/clients-report";
import { resolveRange } from "@/lib/admin/date-range";
import { formatCount } from "@/lib/admin/format";
import { DateRangeFilter, SearchBox, SelectFilter, ClearFilters, PageSizeSelect } from "@/components/admin/insights/Filters";
import { Pagination, parsePaging } from "@/components/admin/insights/Pagination";
import { EmptyState, PageHeader, TONES } from "@/components/admin/insights/StatCard";
import { InfoTip } from "@/components/admin/insights/InfoTip";
import { Reveal } from "@/components/admin/insights/Reveal";
import { ClientsDirectoryList } from "./ClientsDirectoryList";

const ICONS: Record<ClientStatus | "all", React.ReactNode> = {
     all: <Users size={16} />, active: <UserCheck size={16} />, expiring: <AlarmClock size={16} />, pending: <Hourglass size={16} />,
     expired: <CalendarX size={16} />, inactive: <Ban size={16} />, none: <UserX size={16} />,
};
const FILTER_KEYS = ["q", "plan", "range", "from", "to", "dateField", "sort"];

const HEADINGS: Record<ClientStatus | "all", { title: string; description: string }> = {
     all: { title: "All clients", description: "Everyone who has signed up as a client. Use the cards to jump to a group, or search for a person." },
     active: { title: "Active clients", description: "Clients whose plan is paid and still running right now." },
     expiring: { title: "Plans ending soon", description: "Still active, but the plan ends within 7 days. Contact them to renew before they lose access." },
     pending: { title: "Awaiting payment", description: "Clients who started a payment or sent a payment request that is not confirmed yet. Approve or reject manual requests here." },
     expired: { title: "Expired plans", description: "Clients whose plan end date has passed. Renew them once they pay again." },
     inactive: { title: "Cancelled / not started", description: "Clients who chose a plan that was cancelled, rejected, or never activated." },
     none: { title: "Clients with no plan", description: "Clients who signed up but never chose a subscription plan." },
};

export default async function ClientsDirectory({ status, search }: { status: ClientStatus | "all"; search: Record<string, string | undefined> }) {
     const { page, size } = parsePaging(search, 12);
     const hasDate = !!(search.range || search.from || search.to);
     const range = hasDate ? resolveRange(search, "all") : null;

     const [counts, { clients, total }, plans] = await Promise.all([
          fetchStatusCounts(),
          fetchClientDirectory({ status, search, range, page, size }),
          fetchPlanOptions(),
     ]);
     const totalPages = Math.max(1, Math.ceil(total / size));

     const keep = new URLSearchParams();
     for (const k of FILTER_KEYS) if (search[k]) keep.set(k, search[k]!);
     const qs = keep.toString() ? `?${keep.toString()}` : "";
     const tabs: (ClientStatus | "all")[] = ["all", ...STATUS_ORDER];
     const heading = HEADINGS[status];
     const filtered = FILTER_KEYS.some((k) => search[k]);

     return (
          <div className="w-full space-y-5 pb-10">
               <PageHeader icon={<Users size={24} />} title={heading.title} description={heading.description}>
                    <div className="rounded-2xl border border-gray-800 bg-gray-950/50 px-5 py-3 text-center">
                         <p className="text-2xl font-bold text-white tabular-nums">{formatCount(total)}</p>
                         <p className="text-xs text-gray-500">{filtered ? "match your filters" : "clients in this list"}</p>
                    </div>
               </PageHeader>

               {/* Status cards double as tabs */}
               <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-7">
                    {tabs.map((t, i) => {
                         const meta = t === "all" ? { label: "All clients", short: "All", description: "Every client account on the platform, whatever their plan.", tone: "blue" as const, href: "/dashboard/admin/clients/all" } : CLIENT_STATUS_META[t];
                         const tone = TONES[meta.tone];
                         const active = t === status;
                         return (
                              <Reveal key={t} delay={i * 0.03}>
                                   <Link
                                        href={`${meta.href}${qs}`}
                                        className={`group relative flex h-full flex-col gap-2 rounded-2xl border p-3.5 transition-all duration-200 ${active ? "border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-900/20" : "border-gray-800 bg-gray-900/80 hover:-translate-y-0.5 hover:border-gray-700"}`}
                                   >
                                        <span className="flex items-center justify-between">
                                             <span className={`flex size-8 items-center justify-center rounded-lg ${tone.icon}`}>{ICONS[t]}</span>
                                             <InfoTip title={meta.label}>{meta.description}</InfoTip>
                                        </span>
                                        <span className="text-xl font-bold text-white tabular-nums">{formatCount(counts[t])}</span>
                                        <span className={`text-xs font-medium ${active ? "text-blue-200" : "text-gray-400 group-hover:text-gray-200"}`}>{meta.label}</span>
                                   </Link>
                              </Reveal>
                         );
                    })}
               </div>

               {/* Toolbar */}
               <div className="relative z-20 flex flex-col gap-3 rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                         <SearchBox placeholder="Search by name, phone, email or client no." />
                         <SelectFilter param="plan" label="Plan" options={plans.map((p) => ({ value: String(p.id), label: p.name }))} />
                         <SelectFilter param="sort" label="Sort" allLabel={status === "expiring" ? "Ends soonest" : "Newest sign-ups"} options={CLIENT_SORTS.filter((s) => s.value !== "newest").map((s) => ({ value: s.value, label: s.label }))} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                         <SelectFilter param="dateField" label="Date filter uses" allLabel={status === "none" ? "Sign-up date" : "Plan end date"} options={DATE_FIELDS.filter((f) => f.value !== (status === "none" ? "joined" : "expiry")).map((f) => ({ value: f.value, label: f.label }))} />
                         <DateRangeFilter defaultPreset="all" label="Between" />
                         <InfoTip title="Date filter" align="left">Choose which date to filter on: when the plan <b>ends</b>, when the client <b>first subscribed</b>, or when they <b>signed up</b>. Then pick the dates. Example: on the Expired tab, “Plan end date · Last 30 days” shows who expired this past month.</InfoTip>
                         <ClearFilters keys={FILTER_KEYS} />
                    </div>
               </div>

               {clients.length === 0 ? (
                    <EmptyState icon={<Users size={20} />} title={filtered ? "No clients match your filters" : "No clients in this list"} text={filtered ? "Try another search word or clear the filters." : "When a client moves into this group they will appear here automatically."} />
               ) : (
                    <ClientsDirectoryList clients={clients} />
               )}

               <div className="flex flex-col gap-3">
                    <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} total={total} pageSize={size} search={search} itemLabel="clients" />
                    {total > 12 && <div className="flex justify-center sm:justify-end"><PageSizeSelect sizes={[12, 24, 48, 100]} fallback={12} /></div>}
               </div>
          </div>
     );
}
