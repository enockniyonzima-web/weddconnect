"use client";

import { TTransactionAdmin } from "@/select-types/transaction";
import { formatPrice } from "@/util/stringFuncs";
import { getDate } from "@/util/DateFunctions";
import { X, Receipt, User as UserIcon, FileText } from "lucide-react";
import { ContactClientButtons } from "@/components/buttons/ContactClientButtons";
import { TransactionStatusBadge } from "../TransactionStatusBadge";
import { TransactionProviderBadge } from "../TransactionProviderBadge";

export const TransactionDetailsDialog = ({ transaction, onClose }: { transaction: TTransactionAdmin; onClose: () => void }) => {
     const { clientSubscription } = transaction;

     return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
               <div
                    className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
               >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                         <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                   <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                                        <Receipt size={20} />
                                   </div>
                                   <div>
                                        <h3 className="text-lg font-bold">Transaction #{transaction.id}</h3>
                                        <p className="text-xs text-blue-100">{transaction.invoiceNumber ? `Invoice ${transaction.invoiceNumber}` : "Manual payment"}</p>
                                   </div>
                              </div>
                              <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                   <X size={16} />
                              </button>
                         </div>
                         <div className="flex flex-wrap gap-2 mt-4">
                              <TransactionStatusBadge status={transaction.transactionStatus} />
                              <TransactionProviderBadge provider={transaction.provider} />
                         </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                         {/* Payment summary */}
                         <section className="flex flex-col gap-3">
                              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Payment Summary</h4>
                              <div className="grid grid-cols-2 gap-3">
                                   <DetailItem label="Amount" value={`Rwf ${formatPrice(transaction.amount)}`} emphasize />
                                   <DetailItem label="Unit Price × Qty" value={`Rwf ${formatPrice(transaction.price)} × ${transaction.quantity}`} />
                                   <DetailItem label="Method" value={transaction.paymentMethod || transaction.transactionMethod || "—"} />
                                   <DetailItem label="Pay Number" value={transaction.payNumber || "—"} />
                                   <DetailItem label="Created" value={getDate(transaction.createdAt)} />
                                   <DetailItem label="Updated" value={getDate(transaction.updatedAt)} />
                                   {transaction.invoiceNumber && <DetailItem label="Invoice Number" value={transaction.invoiceNumber} />}
                                   {transaction.provider === "MANUAL" && <DetailItem label="Verification Code" value={String(transaction.verificationCode)} />}
                              </div>
                              {transaction.provider === "MANUAL" && transaction.proof && (
                                   <a href={transaction.proof} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 w-fit">
                                        <FileText size={13} /> View proof of payment
                                   </a>
                              )}
                         </section>

                         {/* Plan info */}
                         <section className="flex flex-col gap-3">
                              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Plan</h4>
                              <div className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
                                   <div>
                                        <p className="text-sm font-semibold text-white">{clientSubscription.subscription.name}</p>
                                        <p className="text-xs text-gray-500">{clientSubscription.expiryAt ? `Expires ${getDate(clientSubscription.expiryAt)}` : "No active expiry"}</p>
                                   </div>
                                   <p className="text-sm font-bold text-white">{clientSubscription.subscription.currency} {clientSubscription.subscription.price.toLocaleString()}</p>
                              </div>
                         </section>

                         {/* Client & contact */}
                         <section className="flex flex-col gap-3">
                              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><UserIcon size={13} /> Client & Contact</h4>
                              <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col gap-3">
                                   <div>
                                        <p className="text-sm font-semibold text-white">{clientSubscription.client.name}</p>
                                        <p className="text-xs text-gray-500">{clientSubscription.client.user.email}</p>
                                        <p className="text-xs text-gray-500">{clientSubscription.client.phone}</p>
                                   </div>
                                   <ContactClientButtons phone={clientSubscription.client.phone} email={clientSubscription.client.user.email} clientName={clientSubscription.client.name} />
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

const DetailItem = ({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) => (
     <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-500">{label}</span>
          <span className={emphasize ? "text-base font-bold text-white" : "text-sm text-gray-300"}>{value}</span>
     </div>
);
