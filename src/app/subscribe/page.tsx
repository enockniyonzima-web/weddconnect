import ClientPage from "@/components/layout/ClientPage";
import { fetchSubscriptions } from "@/server-actions/subscription.actions";
import { getSessionUser } from "@/server-actions/user.actions";
import { SSubscriptionCard } from "@/select-types/subscription";
import { isDateLaterThanToday } from "@/util/DateFunctions";
import { CheckCircle, Phone, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ClientSubscriptionViewBtn } from "@/components/views/crm/ClientSubscriptionView";
import { ContactInfo } from "@/lib/data/contact-info";
import { SubscriptionPlanCard } from "@/components/cards/SubscriptionPlanCard";

export default async function SubscribePage() {
     const { user } = await getSessionUser();
     const subscriptions = await fetchSubscriptions(SSubscriptionCard, { isActive: true });

     if (!user) return redirect("/auth/login");
     if (user.admin) return redirect("/dashboard/admin");

     const clientSub = user.client?.subscription ?? null;
     const isActive = clientSub?.expiryAt ? isDateLaterThanToday(clientSub.expiryAt) : false;

     // Already verified active — redirect to posts
     if (isActive) return redirect("/posts");

     // Pending transaction today
     const hasPendingToday = (() => {
          if (!clientSub?.transactions?.[0]) return false;
          const tx = new Date(clientSub.transactions[0].createdAt);
          const now = new Date();
          return tx.getDate() === now.getDate() && tx.getMonth() === now.getMonth() && tx.getFullYear() === now.getFullYear();
     })();

     return (
          <ClientPage>
               <div className="min-h-screen bg-black px-4 py-20 md:py-28">
                    <div className="max-w-4xl mx-auto flex flex-col gap-12">
                         {/* Header */}
                         <div className="text-center flex flex-col gap-3">
                              <div className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mx-auto">
                                   <Sparkles size={12} /> Premium Membership
                              </div>
                              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">Access All Wedding Vendors</h1>
                              <p className="text-gray-400 text-base max-w-md mx-auto">Subscribe to connect with Rwanda&apos;s best wedding photographers, venues, planners and more.</p>
                         </div>

                         {/* Pending notice */}
                         {hasPendingToday && (
                              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 flex flex-col gap-3">
                                   <div className="flex items-center gap-2.5">
                                        <CheckCircle size={20} className="text-blue-400 shrink-0" />
                                        <div>
                                             <h3 className="text-sm font-semibold text-white">Payment Under Review</h3>
                                             <p className="text-xs text-gray-400 mt-0.5">Your payment has been recorded and is being verified. This usually takes 5–30 minutes.</p>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-2 mt-1">
                                        <Link href={`tel:${ContactInfo[0].phone}`} className="flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-blue-600/80 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                                             <Phone size={14} /> Call Us
                                        </Link>
                                        <Link href={`https://wa.me/${ContactInfo[0].phone}`} target="_blank" className="flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-green-600/80 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                                             WhatsApp
                                        </Link>
                                   </div>
                              </div>
                         )}

                         {/* Plans grid */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {subscriptions.sort((a, b) => a.price - b.price).map((plan, i) => {
                                   const isCurrentPlan = clientSub?.subscription?.id === plan.id;
                                   const isPopular = i === 1;
                                   const cta = isCurrentPlan ? (
                                        <div className="w-full py-2.5 text-center rounded-full text-sm font-medium text-gray-500 bg-white/5 border border-white/10 cursor-not-allowed">Current Plan</div>
                                   ) : hasPendingToday ? (
                                        <div className="w-full py-2.5 text-center rounded-full text-sm font-medium text-gray-500 bg-white/5 border border-white/10 cursor-not-allowed">Pending Verification</div>
                                   ) : (
                                        <ClientSubscriptionViewBtn subscription={plan} showBtnName btnSize="md" />
                                   );
                                   return (
                                        <SubscriptionPlanCard
                                             key={plan.id}
                                             plan={plan}
                                             isPopular={isPopular}
                                             isCurrent={isCurrentPlan}
                                             showRwf
                                             cta={cta}
                                        />
                                   );
                              })}
                         </div>

                         {/* Contact footer */}
                         <div className="text-center flex flex-col gap-3 border-t border-white/5 pt-8">
                              <p className="text-sm text-gray-500">Need help choosing a plan? Contact us directly.</p>
                              <div className="flex items-center justify-center gap-3 flex-wrap">
                                   <Link href={`tel:${ContactInfo[0].phone}`} className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"><Phone size={14} /> {ContactInfo[0].phone}</Link>
                                   <span className="text-gray-700">·</span>
                                   <Link href={`https://wa.me/${ContactInfo[0].phone}`} target="_blank" className="text-sm text-green-400 hover:text-green-300 transition-colors">WhatsApp</Link>
                              </div>
                         </div>
                    </div>
               </div>
          </ClientPage>
     );
}