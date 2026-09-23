import { fetchTransactions, countTransactions } from "@/server-actions/transaction.action";
import { STransactionAdmin } from "@/select-types/transaction";
import { Prisma, ETransactionStatus, ETransactionProvider } from "@prisma/client";
import Link from "next/link";
import { TransactionsTable } from "./TransactionsTable";

const STATUS_FILTERS: ETransactionStatus[] = ["PAID", "PENDING", "PARTIALLY_PAID", "FAILED", "EXPIRED"];
const PROVIDER_FILTERS: ETransactionProvider[] = ["IREMBO_PAY", "MANUAL"];

export default async function TransactionsContainer({ search }: { search: Record<string, string | undefined> }) {
     const itemsPerPage = 25;
     const currentPage = search.page ? parseInt(search.page) : 1;

     const where: Prisma.TransactionWhereInput = {};
     if (search.status && STATUS_FILTERS.includes(search.status as ETransactionStatus)) where.transactionStatus = search.status as ETransactionStatus;
     if (search.provider && PROVIDER_FILTERS.includes(search.provider as ETransactionProvider)) where.provider = search.provider as ETransactionProvider;
     if (search.clientSubscriptionId) where.clientSubscriptionId = parseInt(search.clientSubscriptionId);

     const [transactions, total] = await Promise.all([
          fetchTransactions(STransactionAdmin, where, itemsPerPage, (currentPage - 1) * itemsPerPage, { createdAt: "desc" }),
          countTransactions(where),
     ]);

     const totalPages = Math.ceil(total / itemsPerPage);
     const showNext = currentPage < totalPages;
     const showPrev = currentPage > 1;

     const buildFilterHref = (key: string, value?: string) => {
          const params = new URLSearchParams();
          if (search.status && key !== "status") params.set("status", search.status);
          if (search.provider && key !== "provider") params.set("provider", search.provider);
          if (search.clientSubscriptionId) params.set("clientSubscriptionId", search.clientSubscriptionId);
          if (value) params.set(key, value);
          const qs = params.toString();
          return qs ? `?${qs}` : "?";
     };

     return (
          <div className="w-full flex flex-col gap-4">
               <div className="flex flex-wrap gap-2 items-center">
                    <FilterChip label="All" href={buildFilterHref("status")} active={!search.status} />
                    {STATUS_FILTERS.map((s) => (
                         <FilterChip key={s} label={s.replace("_", " ")} href={buildFilterHref("status", s)} active={search.status === s} />
                    ))}
                    <span className="w-px h-5 bg-gray-800 mx-1" />
                    {PROVIDER_FILTERS.map((p) => (
                         <FilterChip key={p} label={p === "IREMBO_PAY" ? "IremboPay" : "Manual"} href={buildFilterHref("provider", search.provider === p ? undefined : p)} active={search.provider === p} />
                    ))}
               </div>

               <TransactionsTable transactions={transactions} />

               {totalPages > 1 && (
                    <div className="flex justify-center items-center py-4 space-x-2">
                         {showPrev && (
                              <Link href={buildFilterHref("page", String(currentPage - 1))} className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">Prev</Link>
                         )}
                         <span className="px-4 py-2 text-sm text-gray-400">Page {currentPage} of {totalPages}</span>
                         {showNext && (
                              <Link href={buildFilterHref("page", String(currentPage + 1))} className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">Next</Link>
                         )}
                    </div>
               )}
          </div>
     );
}

const FilterChip = ({ label, href, active }: { label: string; href: string; active: boolean }) => (
     <Link
          href={href}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${active ? "bg-blue-600 text-white border-blue-600" : "bg-gray-900 text-gray-400 border-gray-700 hover:text-white"}`}
     >
          {label}
     </Link>
);
