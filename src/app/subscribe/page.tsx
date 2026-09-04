import ClientPage from "@/components/layout/ClientPage";
import { fetchSubscriptions } from "@/server-actions/subscription.actions";
import { getSessionUser } from "@/server-actions/user.actions";
import { SSubscriptionCard } from "@/select-types/subscription";
import { isDateLaterThanToday } from "@/util/DateFunctions";
import { Phone, Sparkles } from "lucide-react";
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

                         {/* Plans grid */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {subscriptions.sort((a, b) => a.price - b.price).map((plan, i) => {
                                   const isExpiredPlan = clientSub?.subscription?.id === plan.id;
                                   const isPopular = i === 1;
                                   const cta = <ClientSubscriptionViewBtn subscription={plan} showBtnName btnSize="md" btnTitle={isExpiredPlan ? "Renew Plan" : "Choose Plan"} />;
                                   return (
                                        <SubscriptionPlanCard
                                             key={plan.id}
                                             plan={plan}
                                             isPopular={isPopular}
                                             isExpired={isExpiredPlan}
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