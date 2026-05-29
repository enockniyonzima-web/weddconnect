import { getSessionUser } from "@/server-actions/user.actions";
import { fetchClientById } from "@/server-actions/client.actions";
import { SClientProfile } from "@/select-types/client";
import { redirect } from "next/navigation";
import { format, formatDistanceToNow, isPast } from "date-fns";
import Link from "next/link";
import {
  User, Phone, Mail, Crown, Calendar, Clock, TrendingUp, ArrowRight, ShieldCheck, AlertCircle,
} from "lucide-react";

export default async function ProfilePage() {
  const { user } = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (!user.client) redirect("/");

  const client = await fetchClientById(user.client.id, SClientProfile);
  if (!client) redirect("/");

  const sub = client.subscription;
  const plan = sub?.subscription;
  const expiry = sub?.expiryAt ? new Date(sub.expiryAt) : null;
  const expired = expiry ? isPast(expiry) : false;
  const timeLeft = expiry && !expired ? formatDistanceToNow(expiry, { addSuffix: true }) : null;
  const totalSpent = sub?.transactions.reduce((acc, t) => acc + t.amount, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/40 via-gray-900 to-gray-950 border border-gray-800 px-6 py-8 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.10),_transparent_60%)]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center shrink-0">
              <User size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Welcome back</p>
              <h2 className="text-2xl font-bold text-white">{client.name}</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Mail size={11} />{user.email}
              </p>
            </div>
          </div>
          {plan ? (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-semibold ${expired ? "bg-red-950/40 border-red-800/50 text-red-400" : "bg-blue-600/10 border-blue-600/30 text-blue-400"}`}>
              <Crown size={14} />
              {plan.name}
              {expired && <span className="text-xs font-normal ml-1">(Expired)</span>}
            </div>
          ) : (
            <Link href="/profile/subscription" className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors">
              <Crown size={14} /> Get a plan
            </Link>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Phone", value: client.phone, icon: Phone },
          { label: "Member since", value: format(new Date(user.createdAt), "MMM yyyy"), icon: Calendar },
          { label: "Time left", value: timeLeft ?? (expired ? "Expired" : "No plan"), icon: Clock, warn: expired },
          { label: "Total spent", value: `Rwf ${totalSpent.toLocaleString()}`, icon: TrendingUp },
        ].map(({ label, value, icon: Icon, warn }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Icon size={13} className={warn ? "text-red-400" : "text-blue-400"} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
            <p className={`text-sm font-semibold truncate ${warn ? "text-red-400" : "text-white"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Subscription status card */}
      {sub && plan ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Crown size={14} className="text-blue-400" /> Current Plan</h3>
            <Link href="/profile/subscription" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">Manage <ArrowRight size={11} /></Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-white">{plan.name}</p>
              <p className="text-xs text-gray-500">{plan.description}</p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1">
              <p className="text-xl font-bold text-blue-400">{plan.currency} {plan.price.toLocaleString()}</p>
              {expiry && (
                <div className={`flex items-center gap-1 text-xs ${expired ? "text-red-400" : "text-gray-500"}`}>
                  {expired ? <AlertCircle size={11} /> : <ShieldCheck size={11} />}
                  {expired ? "Expired" : `Expires ${format(expiry, "MMM d, yyyy")}`}
                </div>
              )}
            </div>
          </div>
          {/* Progress bar */}
          {sub.createdAt && expiry && !expired && (
            (() => {
              const start = new Date(sub.createdAt).getTime();
              const end = expiry.getTime();
              const now = Date.now();
              const pct = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
              return (
                <div className="flex flex-col gap-1">
                  <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Started {format(new Date(sub.createdAt), "MMM d")}</span>
                    <span>Expires {format(expiry, "MMM d, yyyy")}</span>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      ) : (
        <div className="bg-gray-900 border border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-3 text-center">
          <Crown size={28} className="text-gray-700" />
          <p className="text-sm text-gray-500">You don&apos;t have an active subscription</p>
          <Link href="/profile/subscription" className="flex items-center gap-1.5 text-sm px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors">
            Browse plans <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Recent transactions */}
      {sub && sub.transactions.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
          <div className="flex flex-col divide-y divide-gray-800">
            {sub.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-xs text-gray-300 truncate">{tx.transactionMethod}</p>
                  <p className="text-xs text-gray-600">{format(new Date(tx.createdAt), "MMM d, yyyy")}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === "APPROVED" ? "bg-green-950/50 text-green-400" : tx.status === "PENDING" ? "bg-yellow-950/50 text-yellow-400" : "bg-red-950/50 text-red-400"}`}>
                    {tx.status}
                  </span>
                  <span className="text-sm font-semibold text-white">Rwf {tx.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
