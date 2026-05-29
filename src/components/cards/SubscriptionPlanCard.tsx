import { TSubscriptionCard } from "@/select-types/subscription";
import { formatPrice } from "@/util/stringFuncs";
import { Check, CheckCircle, ShieldCheck, Zap } from "lucide-react";
import { ReactNode } from "react";

interface SubscriptionPlanCardProps {
     plan: TSubscriptionCard;
     isPopular?: boolean;
     isCurrent?: boolean;
     /** Slot for the CTA — button, link, or disabled state element */
     cta?: ReactNode;
     /** Show price in RWF equivalent below USD */
     showRwf?: boolean;
}

export function SubscriptionPlanCard({ plan, isPopular, isCurrent, cta, showRwf }: SubscriptionPlanCardProps) {
     return (
          <div
               className={`relative rounded-2xl border p-6 flex flex-col gap-4 transition-all ${
                    isCurrent
                         ? "bg-blue-950/30 border-blue-600/50 ring-1 ring-blue-600/30"
                         : isPopular
                         ? "bg-gray-900 border-gray-700 hover:border-blue-600/40"
                         : "bg-gray-900 border-gray-800 hover:border-gray-700"
               }`}
          >
               {isPopular && !isCurrent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white flex items-center gap-1">
                         <Zap size={10} /> Popular
                    </span>
               )}
               {isCurrent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-green-600 text-white flex items-center gap-1">
                         <Check size={10} /> Current
                    </span>
               )}

               {/* Name + duration */}
               <div>
                    <p className="text-sm font-bold text-white">{plan.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.duration} {plan.durationUnit} access</p>
                    {plan.description && (
                         <p className="text-xs text-gray-500 mt-1 leading-relaxed">{plan.description}</p>
                    )}
               </div>

               {/* Price */}
               <div>
                    <p className="text-2xl font-bold text-white">${formatPrice(plan.price)}</p>
                    {showRwf && (
                         <p className="text-xs text-gray-500">~Rwf {formatPrice(plan.price * 1450)}</p>
                    )}
               </div>

               {/* Benefits */}
               {plan.benefits && plan.benefits.length > 0 && (
                    <ul className="flex flex-col gap-2 flex-1">
                         {plan.benefits.map((b, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                   <CheckCircle size={13} className="text-blue-400 shrink-0" />
                                   {b}
                              </li>
                         ))}
                    </ul>
               )}

               {/* CTA or current plan indicator */}
               {isCurrent ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                         <ShieldCheck size={13} /> Your current plan
                    </div>
               ) : (
                    cta ?? null
               )}
          </div>
     );
}
