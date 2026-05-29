"use client";

import { useAuthContext } from "@/components/context/AuthContext";
import { InputSize } from "@/components/ui/forms/text-input";
import { cn } from "@/lib/utils";
import { TSubscriptionCard } from "@/select-types/subscription";
import { Dialog, DialogPanel } from "@headlessui/react";
import { CheckCircle, Copy, Phone, Wallet, X } from "lucide-react";
import { useState } from "react";
import { createClientSubscription, updateClientSubscription } from "@/server-actions/client-subscription.actions";
import { createClient } from "@/server-actions/client.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { ENotificationType } from "@/common/CommonTypes";
import { formatPrice } from "@/util/stringFuncs";
import { copyToClipboard } from "@/util/stringFuncs";
import Link from "next/link";

const USDRate = 1450;

const PAYMENT_ACCOUNTS = [
     {
          method: "Mtn",
          label: "MTN Mobile Money",
          accountName: "Enock Niyonzima",
          accountNumber: "0788399021",
          dialPrefix: "*182*1*1*",
          dialSuffix: "#",
          color: "from-yellow-600/20 to-yellow-800/10 border-yellow-700/30",
          badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
     },
     {
          method: "Equity",
          label: "Equity Bank",
          accountName: "Enock Niyonzima",
          accountNumber: "4012100596469",
          dialPrefix: "*555*3*2*2*",
          dialSuffix: "#",
          color: "from-red-600/20 to-red-800/10 border-red-700/30",
          badge: "bg-red-500/10 text-red-400 border-red-500/20",
     },
];

type Step = 1 | 2 | 3 | 4;

export const ClientSubscriptionView = ({ subscription, onComplete }: { subscription: TSubscriptionCard; onComplete: () => void }) => {
     const { user } = useAuthContext();
     const [step, setStep] = useState<Step>(1);
     const [selectedAccount, setSelectedAccount] = useState<(typeof PAYMENT_ACCOUNTS)[0] | null>(null);
     const [payNumber, setPayNumber] = useState("");
     const [loading, setLoading] = useState(false);
     const [confirmed, setConfirmed] = useState(false);

     const rwfAmount = subscription.price * USDRate;

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

     // Guard: pending transaction today
     const sub = user?.client?.subscription;
     if (sub?.transactions?.[0]) {
          const txDate = new Date(sub.transactions[0].createdAt);
          const today = new Date();
          if (txDate.getDate() === today.getDate() && txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear()) {
               return <PendingScreen />;
          }
     }

     const handleSubmit = async () => {
          if (!payNumber.trim()) return showMainNotification("Enter your payment phone/account number", ENotificationType.WARNING);
          if (!confirmed) return showMainNotification("Please confirm you have made the payment", ENotificationType.WARNING);
          if (!selectedAccount) return showMainNotification("Select a payment account", ENotificationType.WARNING);
          setLoading(true);
          try {
               const clientAcc = user?.client ?? (user ? await createClient({ name: user.email, phone: payNumber, user: { connect: { id: user.id } } }) : null);
               if (!clientAcc) return showMainNotification("Could not identify your account", ENotificationType.FAIL);

               const txData = { amount: rwfAmount, quantity: 1, price: rwfAmount, createdAt: new Date(), updatedAt: new Date(), status: "pending", payNumber, transactionMethod: selectedAccount.method, proof: "" };

               const existingSub = user?.client?.subscription;
               if (existingSub) {
                    const res = await updateClientSubscription(existingSub.id, {
                         expiryAt: null, updatedAt: new Date(),
                         transactions: { create: txData }
                    });
                    if (!res) return showMainNotification("Error updating subscription. Try again", ENotificationType.FAIL);
               } else {
                    const res = await createClientSubscription({
                         createdAt: new Date(), updatedAt: new Date(), expiryAt: null,
                         client: { connect: { id: clientAcc.id } },
                         subscription: { connect: { id: subscription.id } },
                         transactions: { create: txData }
                    });
                    if (!res) return showMainNotification("Error creating subscription. Try again", ENotificationType.FAIL);
               }
               showMainNotification("Payment recorded successfully!", ENotificationType.PASS);
               setStep(4);
          } catch {
               showMainNotification("Application error. Try again later", ENotificationType.FAIL);
          } finally {
               setLoading(false);
          }
     };

     const copyNum = async (num: string) => {
          const ok = await copyToClipboard(num);
          showMainNotification(ok ? "Copied!" : "Copy failed", ok ? ENotificationType.PASS : ENotificationType.FAIL);
     };

     return (
          <div className="flex flex-col gap-5">
               {/* Step indicators */}
               <div className="flex items-center gap-1.5">
                    {([1, 2, 3, 4] as Step[]).map((s) => (
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
                                   <span className="text-3xl font-extrabold text-white">${formatPrice(subscription.price)}</span>
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
                              <span>Equivalent in RWF</span>
                              <span className="text-white font-medium">Rwf {formatPrice(rwfAmount)}</span>
                         </div>
                         <button type="button" onClick={() => setStep(2)} className="w-full py-3 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-colors active:scale-[0.98]">
                              Continue to Payment →
                         </button>
                    </div>
               )}

               {/* Step 2: Choose payment account */}
               {step === 2 && (
                    <div className="flex flex-col gap-4">
                         <div>
                              <h3 className="text-base font-semibold text-white">Choose a payment account</h3>
                              <p className="text-xs text-gray-400 mt-0.5">Send <span className="text-white font-medium">Rwf {formatPrice(rwfAmount)}</span> to one of these accounts</p>
                         </div>
                         {PAYMENT_ACCOUNTS.map((acc) => (
                              <div key={acc.method} className={cn("rounded-xl border bg-gradient-to-br p-4 transition-all", acc.color, selectedAccount?.method === acc.method ? "ring-2 ring-blue-500" : "")}>
                                   <div className="flex items-center justify-between mb-3">
                                        <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", acc.badge)}>{acc.label}</span>
                                   </div>
                                   <div className="flex flex-col gap-1 mb-3">
                                        <div className="flex items-center justify-between">
                                             <span className="text-xs text-gray-400">Account Name</span>
                                             <span className="text-sm text-white font-medium">{acc.accountName}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                             <span className="text-xs text-gray-400">Account Number</span>
                                             <div className="flex items-center gap-1.5">
                                                  <span className="text-sm text-white font-bold">{acc.accountNumber}</span>
                                                  <button type="button" onClick={() => copyNum(acc.accountNumber)} className="text-gray-400 hover:text-white transition-colors"><Copy size={13} /></button>
                                             </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                             <span className="text-xs text-gray-400">Amount</span>
                                             <span className="text-sm text-blue-400 font-bold">Rwf {formatPrice(rwfAmount)}</span>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-2">
                                        <Link href={`tel:${acc.dialPrefix}${acc.accountNumber}*${rwfAmount}${acc.dialSuffix}`} target="_blank" onClick={() => setSelectedAccount(acc)} className="py-2 text-center text-xs font-medium rounded-lg bg-blue-600/80 text-white hover:bg-blue-600 transition-colors">Dial to Pay</Link>
                                        <button type="button" onClick={() => setSelectedAccount(acc)} className={cn("py-2 text-xs font-medium rounded-lg transition-colors border", selectedAccount?.method === acc.method ? "bg-green-600/30 border-green-500/50 text-green-400" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10")}>
                                             {selectedAccount?.method === acc.method ? "✓ Selected" : "Already Paid"}
                                        </button>
                                   </div>
                              </div>
                         ))}
                         <div className="flex gap-2 mt-1">
                              <button type="button" onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-full border border-white/10 text-sm text-gray-300 hover:bg-white/5 transition-colors">← Back</button>
                              <button type="button" disabled={!selectedAccount} onClick={() => setStep(3)} className="flex-[2] py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
                                   Confirm Account & Continue →
                              </button>
                         </div>
                    </div>
               )}

               {/* Step 3: Payment details */}
               {step === 3 && (
                    <div className="flex flex-col gap-4">
                         <div>
                              <h3 className="text-base font-semibold text-white">Confirm your payment</h3>
                              <p className="text-xs text-gray-400 mt-0.5">Paid via <span className="text-white">{selectedAccount?.label}</span> · Rwf {formatPrice(rwfAmount)}</p>
                         </div>
                         <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
                              <label className="flex flex-col gap-1.5">
                                   <span className="text-xs text-gray-400 font-medium">Your Phone / Account Number <span className="text-red-400">*</span></span>
                                   <input
                                        type="text"
                                        value={payNumber}
                                        onChange={(e) => setPayNumber(e.target.value)}
                                        placeholder={selectedAccount?.method === "Mtn" ? "e.g. 0788000000" : "e.g. 4012100000000"}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                                   />
                              </label>
                              <div className="flex items-center justify-between text-xs text-gray-400 bg-black/20 rounded-lg px-3 py-2">
                                   <span>Payment method</span>
                                   <span className="text-white">{selectedAccount?.method}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-400 bg-black/20 rounded-lg px-3 py-2">
                                   <span>Amount sent</span>
                                   <span className="text-blue-400 font-semibold">Rwf {formatPrice(rwfAmount)}</span>
                              </div>
                         </div>
                         <label className="flex items-start gap-3 cursor-pointer group">
                              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/30 accent-blue-500 cursor-pointer" />
                              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">I confirm that I have made this payment to the selected account.</span>
                         </label>
                         <div className="flex gap-2">
                              <button type="button" onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-full border border-white/10 text-sm text-gray-300 hover:bg-white/5 transition-colors">← Back</button>
                              <button type="button" disabled={loading || !confirmed || !payNumber.trim()} onClick={handleSubmit} className="flex-[2] py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
                                   {loading ? "Submitting..." : "Submit Payment Record →"}
                              </button>
                         </div>
                    </div>
               )}

               {/* Step 4: Success */}
               {step === 4 && (
                    <div className="flex flex-col items-center gap-5 py-4 text-center">
                         <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                              <CheckCircle size={32} className="text-green-400" />
                         </div>
                         <div>
                              <h3 className="text-xl font-bold text-white">Payment Recorded!</h3>
                              <p className="text-sm text-gray-400 mt-2 max-w-xs">Your payment has been recorded. It usually takes <span className="text-white">5–30 minutes</span> to verify. You will gain full access after verification.</p>
                         </div>
                         <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
                              <p className="text-xs text-gray-400 mb-1">Need faster verification? Contact us:</p>
                              <div className="grid grid-cols-2 gap-2">
                                   <Link href="tel:0788399021" className="flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-blue-600/80 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                                        <Phone size={14} /> Call Us
                                   </Link>
                                   <Link href="https://wa.me/+250788399021" target="_blank" className="flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-green-600/80 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.946 0C5.369 0 0 5.373 0 11.952c0 2.109.549 4.09 1.508 5.812L0 24l6.438-1.686A11.9 11.9 0 0 0 11.946 24C18.523 24 24 18.631 24 12.048 24 5.465 18.523.096 11.946 0zm.002 21.818a9.84 9.84 0 0 1-5.028-1.381l-.361-.214-3.72.975.993-3.624-.235-.372A9.84 9.84 0 0 1 2.148 12.05c0-5.424 4.39-9.83 9.8-9.83 5.41 0 9.8 4.406 9.8 9.83 0 5.422-4.39 9.768-9.8 9.768z"/></svg>
                                        WhatsApp
                                   </Link>
                              </div>
                         </div>
                         <button type="button" onClick={onComplete} className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2">Close</button>
                    </div>
               )}
          </div>
     );
};

const PendingScreen = () => (
     <div className="flex flex-col items-center gap-5 py-6 text-center">
          <div className="h-14 w-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
               <CheckCircle size={28} className="text-blue-400" />
          </div>
          <div>
               <h3 className="text-lg font-bold text-white">Payment Already Submitted</h3>
               <p className="text-sm text-gray-400 mt-2 max-w-xs">Your payment is currently under review. We will verify it within 5–30 minutes.</p>
          </div>
          <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
               <p className="text-xs text-gray-400 mb-1">Contact us if it is taking too long:</p>
               <div className="grid grid-cols-2 gap-2">
                    <Link href="tel:0788399021" className="flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-blue-600/80 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                         <Phone size={14} /> Call Us
                    </Link>
                    <Link href="https://wa.me/+250788399021" target="_blank" className="flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-green-600/80 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                         WhatsApp
                    </Link>
               </div>
          </div>
     </div>
);

export const ClientSubscriptionViewBtn = ({ subscription, showBtnName = true, showBtnIcon, btnSize = "md", onComplete }: { subscription: TSubscriptionCard; showBtnName?: boolean; showBtnIcon?: boolean; btnSize?: InputSize; onComplete?: () => void }) => {
     const btnTitle = "Choose Plan";
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