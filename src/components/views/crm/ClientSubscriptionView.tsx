"use client";

import { useAuthContext } from "@/components/context/AuthContext";
import { InputSize } from "@/components/ui/forms/text-input";
import { cn } from "@/lib/utils";
import { TSubscriptionCard } from "@/select-types/subscription";
import { Dialog, DialogPanel } from "@headlessui/react";
import { CheckCircle, Loader2, Phone, Wallet, X, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createSubscriptionInvoice } from "@/server-actions/irembo-pay/invoice";
import { loadIremboScript, payInvoice, pollInvoiceStatus } from "@/util/iremboWidget";
import { showMainNotification } from "@/util/NotificationFuncs";
import { ENotificationType, USD_TO_RWF_RATE } from "@/common/CommonTypes";
import { formatPrice } from "@/util/stringFuncs";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4; // 1 summary, 2 confirming, 3 success, 4 not confirmed

export const ClientSubscriptionView = ({ subscription, onComplete }: { subscription: TSubscriptionCard; onComplete: () => void }) => {
     const { user } = useAuthContext();
     const [step, setStep] = useState<Step>(1);
     const [loading, setLoading] = useState(false);
     const cancelPoll = useRef<(() => void) | null>(null);

     const usdAmount = subscription.price / USD_TO_RWF_RATE;

     useEffect(() => () => cancelPoll.current?.(), []);

     // Guard: active subscription
     if (user?.client?.subscription?.expiryAt) {
          const exp = new Date(user.client.subscription.expiryAt);
          if (exp > new Date()) {
               return (
                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                         <CheckCircle size={48} className="text-blue-400" />
                         <h3 className="text-lg font-bold text-white">You have an active subscription</h3>
                         <p className="text-sm text-gray-400 max-w-xs">Your <span className="text-blue-400 font-medium">{user.client.subscription.subscription.name}</span> plan is active until {exp.toLocaleDateString()}.</p>
                         <Link href="/posts" className="mt-2 px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors">Browse Posts</Link>
                    </div>
               );
          }
     }

     const handlePay = async () => {
          setLoading(true);
          try {
               const res = await createSubscriptionInvoice(subscription.id, user?.client?.phone);
               if (res.error || !res.invoiceNumber) {
                    showMainNotification(res.error || "Could not start payment", ENotificationType.FAIL);
                    return;
               }
               const invoiceNumber = res.invoiceNumber;
               await loadIremboScript();
               setStep(2);
               payInvoice(invoiceNumber, () => {
                    cancelPoll.current = pollInvoiceStatus(invoiceNumber, () => setStep(3), () => setStep(4));
               });
          } catch {
               showMainNotification("Application error. Try again later", ENotificationType.FAIL);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="flex flex-col gap-5">
               <div className="flex items-center gap-1.5">
                    {([1, 2, 3] as Step[]).map((s) => (
                         <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-300", step >= s ? "bg-blue-500" : "bg-white/10")} />
                    ))}
               </div>

               {/* Step 1: Plan Summary */}
               {step === 1 && (
                    <div className="flex flex-col gap-5">
                         <div className="rounded-xl border border-blue-600/30 bg-blue-600/10 p-5">
                              <div className="flex items-start justify-between mb-3">
                                   <h3 className="text-xl font-bold text-white">{subscription.name}</h3>
                                   <span className="text-sm font-medium text-blue-300 bg-blue-600/20 px-2.5 py-1 rounded-full border border-blue-600/30">{subscription.duration} {subscription.durationUnit}</span>
                              </div>
                              <div className="mb-4">
                                   <span className="text-3xl font-extrabold text-white">{subscription.currency}{formatPrice(subscription.price)}</span>
                                   <span className="text-gray-400 text-sm ml-1.5">/ {subscription.durationUnit}</span>
                              </div>
                              {subscription.benefits && subscription.benefits.length > 0 && (
                                   <ul className="flex flex-col gap-2">
                                        {subscription.benefits.map((b, i) => (
                                             <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                                  <CheckCircle size={14} className="text-blue-400 shrink-0" />
                                                  {b}
                                             </li>
                                        ))}
                                   </ul>
                              )}
                              {subscription.description && (
                                   <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-white/10">{subscription.description}</p>
                              )}
                         </div>
                         <div className="flex items-center justify-between text-xs text-gray-500 bg-white/5 rounded-lg px-4 py-2.5">
                              <span>Equivalent in USD</span>
                              <span className="text-white font-medium">USD {formatPrice(usdAmount)}</span>
                         </div>
                         <button type="button" disabled={loading} onClick={handlePay} className="w-full py-3 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
                              {loading ? "Starting payment..." : "Pay with IremboPay →"}
                         </button>
                    </div>
               )}

               {/* Step 2: Confirming (widget open / polling) */}
               {step === 2 && (
                    <div className="flex flex-col items-center gap-5 py-8 text-center">
                         <Loader2 size={40} className="text-blue-400 animate-spin" />
                         <div>
                              <h3 className="text-lg font-bold text-white">Confirming your payment...</h3>
                              <p className="text-sm text-gray-400 mt-2 max-w-xs">Complete the payment in the IremboPay window. This updates automatically once it&apos;s confirmed.</p>
                         </div>
                    </div>
               )}

               {/* Step 3: Success */}
               {step === 3 && (
                    <div className="flex flex-col items-center gap-5 py-4 text-center">
                         <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                              <CheckCircle size={32} className="text-green-400" />
                         </div>
                         <div>
                              <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
                              <p className="text-sm text-gray-400 mt-2 max-w-xs">Your subscription is now active. Enjoy full access to WeddConnect.</p>
                         </div>
                         <Link href="/posts" onClick={onComplete} className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors">Browse Posts</Link>
                    </div>
               )}

               {/* Step 4: Not confirmed in time */}
               {step === 4 && (
                    <div className="flex flex-col items-center gap-5 py-4 text-center">
                         <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                              <XCircle size={32} className="text-red-400" />
                         </div>
                         <div>
                              <h3 className="text-xl font-bold text-white">Payment Not Confirmed</h3>
                              <p className="text-sm text-gray-400 mt-2 max-w-xs">We couldn&apos;t confirm your payment yet. If you completed it, contact us — otherwise try again.</p>
                         </div>
                         <div className="grid grid-cols-2 gap-2 w-full">
                              <button type="button" onClick={handlePay} className="py-2.5 rounded-full border border-white/10 text-sm text-gray-300 hover:bg-white/5 transition-colors">Try Again</button>
                              <Link href="tel:0788399021" className="flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-blue-600/80 text-white text-sm font-medium hover:bg-blue-600 transition-colors"><Phone size={14} /> Call Us</Link>
                         </div>
                    </div>
               )}
          </div>
     );
};

export const ClientSubscriptionViewBtn = ({ subscription, showBtnName = true, showBtnIcon, btnSize = "md", btnTitle = "Choose Plan", onComplete }: { subscription: TSubscriptionCard; showBtnName?: boolean; showBtnIcon?: boolean; btnSize?: InputSize; btnTitle?: string; onComplete?: () => void }) => {
     const Icon = Wallet;
     const [open, setOpen] = useState(false);
     const sizeClasses: Record<InputSize, string> = { sm: "h-8 px-3 text-xs gap-1.5", md: "h-10 px-4 text-sm gap-2", lg: "h-12 px-5 text-base gap-2" };
     const iconSizes: Record<InputSize, number> = { sm: 14, md: 16, lg: 18 };
     const handleComplete = () => {
          setOpen(false);
          onComplete?.();
     };

     return (
          <>
               <button type="button" onClick={() => setOpen(true)} className={cn("inline-flex items-center justify-center rounded-full font-medium cursor-pointer transition-all duration-200 active:scale-[0.97] bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500", sizeClasses[btnSize])}>
                    {showBtnIcon && <Icon size={iconSizes[btnSize]} strokeWidth={2} className="shrink-0" />}
                    {showBtnName && <span>{btnTitle}</span>}
               </button>
               <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                         <DialogPanel className="relative w-[92vw] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/50">
                              <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-900" />
                              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/5 bg-gray-900/95 backdrop-blur-md px-5 py-4 rounded-t-2xl">
                                   <div className="flex items-center gap-2.5">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/25"><Wallet size={16} strokeWidth={2} /></div>
                                        <div>
                                             <h3 className="text-sm font-semibold text-white">Subscribe to {subscription.name}</h3>
                                             <p className="text-xs text-gray-400">${formatPrice(subscription.price)} / {subscription.durationUnit}</p>
                                        </div>
                                   </div>
                                   <button type="button" onClick={() => setOpen(false)} title="Close" className="flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-gray-400 cursor-pointer transition-all hover:bg-white/10 hover:text-white hover:border-white/20"><X size={15} strokeWidth={2} /></button>
                              </div>
                              <div className="relative px-5 py-5">
                                   <ClientSubscriptionView onComplete={handleComplete} subscription={subscription} />
                              </div>
                              <div className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-transparent via-blue-600/20 to-transparent" />
                         </DialogPanel>
                    </div>
               </Dialog>
          </>
     );
};
