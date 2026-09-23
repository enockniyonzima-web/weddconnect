"use client";

import { TTransactionAdmin } from "@/select-types/transaction";
import { formatPrice } from "@/util/stringFuncs";
import { getDate } from "@/util/DateFunctions";
import { X, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ContactClientButtons } from "@/components/buttons/ContactClientButtons";
import { TransactionStatusBadge } from "../TransactionStatusBadge";

export const ClientDetailsDialog = ({
     transaction,
     recentTransactions,
     onClose,
}: {
     transaction: TTransactionAdmin;
     recentTransactions: TTransactionAdmin[];
     onClose: () => void;
}) => {
     const { clientSubscription } = transaction;
     const { client } = clientSubscription;
     const expired = clientSubscription.expiryAt ? new Date(clientSubscription.expiryAt) < new Date() : true;
     const initial = client.name?.[0]?.toUpperCase() || "?";

     return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
               <div
                    className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
               >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                         <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                   <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-lg font-bold shrink-0">{initial}</div>
                                   <div>
                                        <h3 className="text-lg font-bold">{client.name}</h3>
                                        <p className="text-xs text-blue-100">Client #{client.id}</p>
                                   </div>
                              </div>
                              <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                   <X size={16} />
                              </button>
                         </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                         <section className="flex flex-col gap-3">
                              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact</h4>
                              <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col gap-3">
                                   <div className="flex flex-col gap-0.5">
                                        <span className="text-sm text-gray-300">{client.user.email}</span>
                                        <span className="text-sm text-gray-300">{client.phone}</span>
                                   </div>
                                   <ContactClientButtons phone={client.phone} email={client.user.email} clientName={client.name} />
                              </div>
                         </section>

                         <section className="flex flex-col gap-3">
                              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Subscription</h4>
                              <div className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
                                   <div>
                                        <p className="text-sm font-semibold text-white">{clientSubscription.subscription.name}</p>
                                        <p className={`text-xs flex items-center gap-1 mt-0.5 ${expired ? "text-red-400" : "text-green-400"}`}>
                                             {expired ? <AlertCircle size={11} /> : <ShieldCheck size={11} />}
                                             {clientSubscription.expiryAt ? (expired ? `Expired ${getDate(clientSubscription.expiryAt)}` : `Active · expires ${getDate(clientSubscription.expiryAt)}`) : "No active expiry"}
                                        </p>
                                   </div>
                                   <p className="text-sm font-bold text-white">{clientSubscription.subscription.currency} {clientSubscription.subscription.price.toLocaleString()}</p>
                              </div>
                         </section>

                         <section className="flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                   <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Payments</h4>
                                   <Link href={`/dashboard/admin/finance/transactions?clientSubscriptionId=${clientSubscription.id}`} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                        Full history <ArrowRight size={11} />
                                   </Link>
                              </div>
                              <div className="flex flex-col divide-y divide-gray-800">
                                   {recentTransactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between py-2.5 gap-3">
                                             <div className="flex flex-col gap-0.5 min-w-0">
                                                  <span className="text-sm text-gray-300">Rwf {formatPrice(tx.amount)}</span>
                                                  <span className="text-xs text-gray-600">{getDate(tx.createdAt)}</span>
                                             </div>
                                             <TransactionStatusBadge status={tx.transactionStatus} />
                                        </div>
                                   ))}
                              </div>
                         </section>
                    </div>

                    <div className="border-t border-gray-800 bg-gray-800/50 p-4 flex justify-end">
                         <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">Close</button>
                    </div>
               </div>
          </div>
     );
};
