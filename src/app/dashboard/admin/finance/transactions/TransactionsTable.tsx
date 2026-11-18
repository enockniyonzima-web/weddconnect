"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { TTransactionAdmin } from "@/select-types/transaction";
import { formatRwf, formatDate, formatDateTime } from "@/lib/admin/format";
import { txGroup, TxGroup } from "@/lib/admin/tx-group";
import { ChevronRight, User, CheckCircle2, Clock, XCircle, AlertCircle, MinusCircle, Wallet, CreditCard } from "lucide-react";
import { TransactionDetailsDialog } from "./TransactionDetailsDialog";
import { ClientDetailsDialog } from "./ClientDetailsDialog";

const RESULT: Record<TxGroup, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
     paid: { label: "Paid", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", icon: CheckCircle2 },
     pending: { label: "Awaiting payment", cls: "bg-blue-500/10 text-blue-300 border-blue-500/20", icon: Clock },
     failed: { label: "Failed / cancelled", cls: "bg-rose-500/10 text-rose-300 border-rose-500/20", icon: XCircle },
     partial: { label: "Partially paid", cls: "bg-amber-500/10 text-amber-300 border-amber-500/20", icon: AlertCircle },
     other: { label: "Unknown", cls: "bg-gray-700/30 text-gray-400 border-gray-700", icon: MinusCircle },
};

export const ResultBadge = ({ tx }: { tx: Pick<TTransactionAdmin, "transactionStatus" | "status"> }) => {
     const r = RESULT[txGroup(tx)];
     return (
          <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${r.cls}`}>
               <r.icon size={12} /> {r.label}
          </span>
     );
};

const Method = ({ tx }: { tx: TTransactionAdmin }) => {
     const irembo = tx.provider === "IREMBO_PAY";
     const Icon = irembo ? Wallet : CreditCard;
     const detail = irembo ? tx.paymentMethod?.replace(/_/g, " ").toLowerCase() : tx.transactionMethod;
     return (
          <span className="flex items-center gap-2 text-sm text-gray-300">
               <span className={`flex size-7 items-center justify-center rounded-lg ${irembo ? "bg-blue-500/10 text-blue-300" : "bg-gray-700/40 text-gray-300"}`}><Icon size={14} /></span>
               <span className="leading-tight">
                    {irembo ? "IremboPay" : "Manual"}
                    {detail && <span className="block text-xs capitalize text-gray-500">{detail}</span>}
               </span>
          </span>
     );
};

const Avatar = ({ name }: { name: string }) => (
     <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 text-sm font-semibold text-white">
          {name?.[0]?.toUpperCase() || "?"}
     </span>
);

export const TransactionsTable = ({ transactions }: { transactions: TTransactionAdmin[] }) => {
     const [viewingTransaction, setViewingTransaction] = useState<TTransactionAdmin | null>(null);
     const [viewingClient, setViewingClient] = useState<TTransactionAdmin | null>(null);

     const recentForClient = (tx: TTransactionAdmin) => transactions.filter((t) => t.clientSubscription.id === tx.clientSubscription.id).slice(0, 5);
     const planName = (tx: TTransactionAdmin) => (tx.subscription ?? tx.clientSubscription.subscription).name;

     return (
          <>
               {/* Desktop table */}
               <div className="hidden overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 md:block">
                    <table className="w-full border-collapse">
                         <thead>
                              <tr className="border-b border-gray-800 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                   <th className="px-4 py-3">Client</th>
                                   <th className="px-4 py-3">Plan</th>
                                   <th className="px-4 py-3 text-right">Amount</th>
                                   <th className="px-4 py-3">Result</th>
                                   <th className="px-4 py-3">Paid via</th>
                                   <th className="px-4 py-3">Date</th>
                                   <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                              </tr>
                         </thead>
                         <tbody>
                              {transactions.map((tx, i) => (
                                   <motion.tr
                                        key={tx.id}
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                                        onClick={() => setViewingTransaction(tx)}
                                        className="group cursor-pointer border-b border-gray-800/70 last:border-0 transition-colors hover:bg-gray-800/40"
                                   >
                                        <td className="px-4 py-3">
                                             <div className="flex items-center gap-3">
                                                  <Avatar name={tx.clientSubscription.client.name} />
                                                  <div className="min-w-0">
                                                       <p className="truncate text-sm font-medium text-white">{tx.clientSubscription.client.name}</p>
                                                       <p className="truncate text-xs text-gray-500">{tx.clientSubscription.client.phone || tx.clientSubscription.client.user.email}</p>
                                                  </div>
                                             </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-300">{planName(tx)}</td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-white tabular-nums whitespace-nowrap">{formatRwf(tx.amount)}</td>
                                        <td className="px-4 py-3"><ResultBadge tx={tx} /></td>
                                        <td className="px-4 py-3"><Method tx={tx} /></td>
                                        <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                                             {formatDate(tx.createdAt)}
                                             <span className="block text-xs text-gray-600">#{tx.id}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                             <div className="flex items-center justify-end gap-1">
                                                  <button
                                                       type="button"
                                                       onClick={(e) => { e.stopPropagation(); setViewingClient(tx); }}
                                                       className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                                                       title="View client"
                                                  >
                                                       <User size={13} /> Client
                                                  </button>
                                                  <ChevronRight size={16} className="text-gray-600 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-300" />
                                             </div>
                                        </td>
                                   </motion.tr>
                              ))}
                         </tbody>
                    </table>
               </div>

               {/* Mobile cards */}
               <ul className="flex flex-col gap-3 md:hidden">
                    {transactions.map((tx, i) => (
                         <motion.li key={tx.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                              <button type="button" onClick={() => setViewingTransaction(tx)} className="w-full rounded-2xl border border-gray-800 bg-gray-900/80 p-4 text-left transition-colors active:bg-gray-800/60">
                                   <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                             <Avatar name={tx.clientSubscription.client.name} />
                                             <div className="min-w-0">
                                                  <p className="truncate text-sm font-medium text-white">{tx.clientSubscription.client.name}</p>
                                                  <p className="text-xs text-gray-500">{planName(tx)} · {formatDateTime(tx.createdAt)}</p>
                                             </div>
                                        </div>
                                        <p className="shrink-0 text-sm font-bold text-white tabular-nums">{formatRwf(tx.amount)}</p>
                                   </div>
                                   <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                        <ResultBadge tx={tx} />
                                        <span className="text-xs text-gray-500">{tx.provider === "IREMBO_PAY" ? "IremboPay" : "Manual"} · #{tx.id}</span>
                                   </div>
                              </button>
                         </motion.li>
                    ))}
               </ul>

               {viewingTransaction && <TransactionDetailsDialog transaction={viewingTransaction} onClose={() => setViewingTransaction(null)} />}
               {viewingClient && <ClientDetailsDialog transaction={viewingClient} recentTransactions={recentForClient(viewingClient)} onClose={() => setViewingClient(null)} />}
          </>
     );
};
