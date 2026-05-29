import { getSessionUser } from "@/server-actions/user.actions";
import { fetchClientById } from "@/server-actions/client.actions";
import { fetchSubscriptions } from "@/server-actions/subscription.actions";
import { SClientProfile } from "@/select-types/client";
import { SSubscriptionCard } from "@/select-types/subscription";
import { redirect } from "next/navigation";
import { format, formatDistanceToNow, isPast } from "date-fns";
import Link from "next/link";
import { Crown, AlertCircle, ShieldCheck, Clock } from "lucide-react";
import { SubscriptionPlanCard } from "@/components/cards/SubscriptionPlanCard";

export default async function ProfileSubscriptionPage() {
  const { user } = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (!user.client) redirect("/");

  const [client, allPlans] = await Promise.all([
    fetchClientById(user.client.id, SClientProfile),
    fetchSubscriptions(SSubscriptionCard),
  ]);
  if (!client) redirect("/");

  const sub = client.subscription;
  const activePlanId = sub?.subscription?.id;
  const expiry = sub?.expiryAt ? new Date(sub.expiryAt) : null;
  const expired = expiry ? isPast(expiry) : false;
  const timeLeft = expiry && !expired ? formatDistanceToNow(expiry, { addSuffix: true }) : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Current plan banner */}
      {sub && sub.subscription ? (
        <div className={`rounded-3xl border p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between ${expired ? "bg-red-950/20 border-red-800/40" : "bg-blue-950/20 border-blue-800/30"}`}>
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${expired ? "bg-red-900/40" : "bg-blue-600/20"}`}>
              <Crown size={22} className={expired ? "text-red-400" : "text-blue-400"} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Current Plan</p>
              <p className="text-lg font-bold text-white">{sub.subscription.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub.subscription.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
            <p className="text-2xl font-bold text-white">{sub.subscription.currency} {sub.subscription.price.toLocaleString()}</p>
            {expiry ? (
              <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${expired ? "bg-red-900/40 text-red-400" : "bg-green-900/30 text-green-400"}`}>
                {expired ? <AlertCircle size={11} /> : <ShieldCheck size={11} />}
                {expired ? `Expired ${format(expiry, "MMM d, yyyy")}` : `Active · expires ${timeLeft}`}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-900/30 px-3 py-1 rounded-full">
                <ShieldCheck size={11} /> Active
              </div>
            )}
            <p className="text-xs text-gray-600">Subscribed {format(new Date(sub.createdAt), "MMM d, yyyy")}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-900/50 p-8 flex flex-col items-center gap-2 text-center">
          <Crown size={30} className="text-gray-700" />
          <p className="text-sm font-semibold text-gray-400">No active subscription</p>
          <p className="text-xs text-gray-600">Choose a plan below to get started</p>
        </div>
      )}

      {/* Time remaining bar */}
      {sub?.createdAt && expiry && !expired && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock size={11} /> Time remaining</span>
            <span className="text-blue-400 font-medium">{timeLeft}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            {(() => {
              const pct = Math.max(0, Math.min(100,
                ((Date.now() - new Date(sub.createdAt).getTime()) / (expiry.getTime() - new Date(sub.createdAt).getTime())) * 100
              ));
              return <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{ width: `${pct}%` }} />;
            })()}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{format(new Date(sub.createdAt), "MMM d, yyyy")}</span>
            <span>{format(expiry, "MMM d, yyyy")}</span>
          </div>
        </div>
      )}

      {/* All plans */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-white">Available Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPlans.map((plan, i) => {
            const isCurrent = plan.id === activePlanId;
            const isPopular = i === 1;
            const cta = (
              <Link
                href={`/subscribe?plan=${plan.id}`}
                className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                {sub ? "Switch plan" : "Get started"}
              </Link>
            );
            return (
              <SubscriptionPlanCard
                key={plan.id}
                plan={plan}
                isPopular={isPopular}
                isCurrent={isCurrent}
                cta={cta}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
