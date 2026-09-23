"use client";

import { useState } from "react";
import { TTransactionAdmin } from "@/select-types/transaction";
import { formatPrice } from "@/util/stringFuncs";
import { getDate } from "@/util/DateFunctions";
import { Eye, User } from "lucide-react";
import { TransactionStatusBadge } from "../TransactionStatusBadge";
import { TransactionProviderBadge } from "../TransactionProviderBadge";
import { TransactionDetailsDialog } from "./TransactionDetailsDialog";
import { ClientDetailsDialog } from "./ClientDetailsDialog";

export const TransactionsTable = ({ transactions }: { transactions: TTransactionAdmin[] }) => {
     const [viewingTransaction, setViewingTransaction] = useState<TTransactionAdmin | null>(null);
     const [viewingClient, setViewingClient] = useState<TTransactionAdmin | null>(null);

     const recentForClient = (tx: TTransactionAdmin) =>
          transactions.filter((t) => t.clientSubscription.id === tx.clientSubscription.id).slice(0, 5);

     if (transactions.length === 0) {
          return (
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                    <p className="text-gray-500">No transactions found</p>
               </div>
          );
     }

     return (
          <>
               <div className="w-full overflow-x-auto bg-gray-900 border border-gray-800 rounded-xl">
                    <table className="w-full border-collapse">
                         <thead>
                              <tr className="bg-gray-800 text-left text-gray-300 text-xs">
                                   <th className="p-3">Date</th>
                                   <th className="p-3">Client</th>
                                   <th className="p-3">Plan</th>
                                   <th className="p-3">Amount</th>
                                   <th className="p-3">Provider</th>
                                   <th className="p-3">Status</th>
                                   <th className="p-3">Actions</th>
                              </tr>
                         </thead>
                         <tbody>
                              {transactions.map((tx) => (
                                   <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="p-3 text-gray-400 text-sm text-nowrap">{getDate(tx.createdAt)}</td>
                                        <td className="p-3 text-gray-300 text-sm text-nowrap">{tx.clientSubscription.client.name}</td>
                                        <td className="p-3 text-gray-400 text-sm text-nowrap">{tx.clientSubscription.subscription.name}</td>
                                        <td className="p-3 text-white text-sm font-semibold text-nowrap">Rwf {formatPrice(tx.amount)}</td>
                                        <td className="p-3"><TransactionProviderBadge provider={tx.provider} /></td>
                                        <td className="p-3"><TransactionStatusBadge status={tx.transactionStatus} /></td>
                                        <td className="p-3">
                                             <div className="flex gap-2">
                                                  <button
                                                       type="button"
                                                       onClick={() => setViewingTransaction(tx)}
                                                       className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors"
                                                  >
                                                       <Eye size={13} /> Details
                                                  </button>
                                                  <button
                                                       type="button"
                                                       onClick={() => setViewingClient(tx)}
                                                       className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors"
                                                  >
                                                       <User size={13} /> Client
                                                  </button>
                                             </div>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>

               {viewingTransaction && <TransactionDetailsDialog transaction={viewingTransaction} onClose={() => setViewingTransaction(null)} />}
               {viewingClient && (
                    <ClientDetailsDialog transaction={viewingClient} recentTransactions={recentForClient(viewingClient)} onClose={() => setViewingClient(null)} />
               )}
          </>
     );
};
