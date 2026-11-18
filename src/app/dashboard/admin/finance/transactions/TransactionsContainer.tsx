import { fetchTransactions, countTransactions } from "@/server-actions/transaction.action";
import { STransactionAdmin } from "@/select-types/transaction";
import { Prisma, ETransactionProvider } from "@prisma/client";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { X, Receipt, Wallet, Clock, Hash } from "lucide-react";
import { resolveRange, rangeFilter } from "@/lib/admin/date-range";
import { TX_GROUP_WHERE } from "@/lib/admin/finance-report";
import { REVENUE_TX_WHERE, PENDING_TX_WHERE } from "@/lib/admin/client-status";
import { formatRwf, formatCount } from "@/lib/admin/format";
import { DateRangeFilter, SearchBox, SelectFilter, ChipFilter, ClearFilters, PageSizeSelect } from "@/components/admin/insights/Filters";
import { Pagination, parsePaging } from "@/components/admin/insights/Pagination";
import { StatCard, EmptyState } from "@/components/admin/insights/StatCard";
import { TransactionsTable } from "./TransactionsTable";
import { ReconcilePendingButton } from "./ReconcilePendingButton";

const GROUPS = [
     { value: "paid", label: "Paid" },
     { value: "pending", label: "Awaiting payment" },
     { value: "failed", label: "Failed / cancelled" },
     { value: "partial", label: "Partially paid" },
] as const;
const PROVIDERS: { value: ETransactionProvider; label: string }[] = [
     { value: "IREMBO_PAY", label: "IremboPay" },
     { value: "MANUAL", label: "Manual" },
];
const FILTER_KEYS = ["q", "group", "provider", "range", "from", "to", "plan", "client", "clientSubscriptionId", "status"];

export default async function TransactionsContainer({ search }: { search: Record<string, string | undefined> }) {
     const { page, size, skip } = parsePaging(search, 25);
     const range = resolveRange(search, "all");

     const and: Prisma.TransactionWhereInput[] = [{ createdAt: rangeFilter(range) }];
     // `group` is the plain-language status; `status` is kept so older links keep working.
     const group = (search.group ?? (search.status === "PAID" ? "paid" : search.status === "PENDING" ? "pending" : undefined)) as keyof typeof TX_GROUP_WHERE | undefined;
     if (group && TX_GROUP_WHERE[group]) and.push(TX_GROUP_WHERE[group]);
     if (search.provider && PROVIDERS.some((p) => p.value === search.provider)) and.push({ provider: search.provider as ETransactionProvider });
     const planId = Number(search.plan);
     if (Number.isInteger(planId) && planId > 0) and.push({ OR: [{ subscriptionId: planId }, { subscriptionId: null, clientSubscription: { subscriptionId: planId } }] });
     const clientId = Number(search.client);
     if (Number.isInteger(clientId) && clientId > 0) and.push({ clientSubscription: { clientId } });
     const csId = Number(search.clientSubscriptionId);
     if (Number.isInteger(csId) && csId > 0) and.push({ clientSubscriptionId: csId });

     const q = search.q?.trim();
     if (q) {
          const contains = { contains: q, mode: "insensitive" as const };
          const or: Prisma.TransactionWhereInput[] = [
               { clientSubscription: { client: { name: contains } } },
               { clientSubscription: { client: { phone: contains } } },
               { clientSubscription: { client: { user: { email: contains } } } },
               { invoiceNumber: contains },
               { payNumber: contains },
          ];
          const asId = Number(q.replace(/^#/, ""));
          if (Number.isInteger(asId) && asId > 0 && asId < 2_147_483_647) or.push({ id: asId });
          and.push({ OR: or });
     }
     const where: Prisma.TransactionWhereInput = { AND: and };

     const [transactions, total, paidAgg, pendingAgg, planRow, clientRow] = await Promise.all([
          fetchTransactions(STransactionAdmin, where, size, skip, { createdAt: "desc" }),
          countTransactions(where),
          prisma.transaction.aggregate({ _sum: { amount: true }, _count: true, where: { AND: [where, REVENUE_TX_WHERE] } }),
          prisma.transaction.aggregate({ _sum: { amount: true }, _count: true, where: { AND: [where, PENDING_TX_WHERE] } }),
          planId > 0 ? prisma.subscription.findUnique({ where: { id: planId }, select: { name: true } }) : null,
          clientId > 0 ? prisma.client.findUnique({ where: { id: clientId }, select: { name: true } }) : null,
     ]);
     const totalPages = Math.max(1, Math.ceil(total / size));

     const removeHref = (key: string) => {
          const p = new URLSearchParams();
          for (const [k, v] of Object.entries(search)) if (v && k !== key && k !== "page") p.set(k, v);
          return `?${p.toString()}`;
     };
     const linkChips = [
          planRow && { key: "plan", label: `Plan: ${planRow.name}` },
          clientRow && { key: "client", label: `Client: ${clientRow.name}` },
          csId > 0 && { key: "clientSubscriptionId", label: `Subscription #${csId}` },
     ].filter(Boolean) as { key: string; label: string }[];

     return (
          <div className="w-full flex flex-col gap-5">
               {/* Summary of what the filters currently match */}
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard title="Matching transactions" value={formatCount(total)} icon={<Hash size={20} />} tone="blue" sub={range.label} info="How many transactions match the search and filters you chose below. Clear the filters to see everything." />
                    <StatCard title="Received (in this list)" value={formatRwf(paidAgg._sum.amount)} icon={<Wallet size={20} />} tone="green" delay={0.05} sub={`${formatCount(paidAgg._count)} successful`} info="Sum of the successful payments among the transactions shown by your current filters. Pending or failed ones are not added." />
                    <StatCard title="Waiting (in this list)" value={formatRwf(pendingAgg._sum.amount)} icon={<Clock size={20} />} tone="amber" delay={0.1} sub={`${formatCount(pendingAgg._count)} not yet confirmed`} info="Sum of payments in this list that were started but not confirmed yet. This money has not been received." />
               </div>

               {/* Toolbar */}
               <div className="relative z-20 flex flex-col gap-3 rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                         <SearchBox placeholder="Search by client name, phone, email, invoice or transaction no." />
                         <DateRangeFilter defaultPreset="all" label="Date" />
                         <SelectFilter param="provider" label="Paid via" options={PROVIDERS} />
                         <ClearFilters keys={FILTER_KEYS} />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                         <ChipFilter param="group" options={GROUPS.map((g) => ({ value: g.value, label: g.label }))} />
                         <ReconcilePendingButton />
                    </div>
                    {linkChips.length > 0 && (
                         <div className="flex flex-wrap gap-2">
                              {linkChips.map((c) => (
                                   <Link key={c.key} href={removeHref(c.key)} className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-200 hover:bg-blue-500/20">
                                        {c.label} <X size={12} />
                                   </Link>
                              ))}
                         </div>
                    )}
               </div>

               {transactions.length === 0 ? (
                    <EmptyState icon={<Receipt size={20} />} title="No transactions match" text="Try a different search word, a longer date range, or clear the filters." />
               ) : (
                    <TransactionsTable transactions={transactions} />
               )}

               <div className="flex flex-col gap-3">
                    <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} total={total} pageSize={size} search={search} itemLabel="transactions" />
                    {total > 10 && <div className="flex justify-center sm:justify-end"><PageSizeSelect /></div>}
               </div>
          </div>
     );
}
