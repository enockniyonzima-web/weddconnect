import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { InfoTip } from "./InfoTip";
import { Reveal } from "./Reveal";

export type Tone = "green" | "amber" | "blue" | "red" | "gray" | "slate" | "purple" | "teal";

export const TONES: Record<Tone, { icon: string; ring: string; glow: string; text: string; bar: string; soft: string }> = {
     green: { icon: "bg-emerald-500/15 text-emerald-300", ring: "hover:border-emerald-500/40", glow: "from-emerald-500/20", text: "text-emerald-300", bar: "#34d399", soft: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
     amber: { icon: "bg-amber-500/15 text-amber-300", ring: "hover:border-amber-500/40", glow: "from-amber-500/20", text: "text-amber-300", bar: "#fbbf24", soft: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
     blue: { icon: "bg-blue-500/15 text-blue-300", ring: "hover:border-blue-500/40", glow: "from-blue-500/20", text: "text-blue-300", bar: "#60a5fa", soft: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
     red: { icon: "bg-rose-500/15 text-rose-300", ring: "hover:border-rose-500/40", glow: "from-rose-500/20", text: "text-rose-300", bar: "#fb7185", soft: "bg-rose-500/10 text-rose-300 border-rose-500/20" },
     gray: { icon: "bg-gray-500/15 text-gray-300", ring: "hover:border-gray-500/40", glow: "from-gray-500/20", text: "text-gray-300", bar: "#9ca3af", soft: "bg-gray-500/10 text-gray-300 border-gray-500/20" },
     slate: { icon: "bg-slate-500/15 text-slate-300", ring: "hover:border-slate-500/40", glow: "from-slate-500/20", text: "text-slate-300", bar: "#94a3b8", soft: "bg-slate-500/10 text-slate-300 border-slate-500/20" },
     purple: { icon: "bg-violet-500/15 text-violet-300", ring: "hover:border-violet-500/40", glow: "from-violet-500/20", text: "text-violet-300", bar: "#a78bfa", soft: "bg-violet-500/10 text-violet-300 border-violet-500/20" },
     teal: { icon: "bg-teal-500/15 text-teal-300", ring: "hover:border-teal-500/40", glow: "from-teal-500/20", text: "text-teal-300", bar: "#2dd4bf", soft: "bg-teal-500/10 text-teal-300 border-teal-500/20" },
};

export interface StatCardProps {
     title: string;
     value: string;
     sub?: React.ReactNode;
     icon: React.ReactNode;
     tone?: Tone;
     info?: React.ReactNode;
     href?: string;
     linkLabel?: string;
     /** % change vs previous period; null = no comparable previous value. */
     change?: number | null;
     changeLabel?: string;
     /** Set when a rise is bad news (e.g. failed payments). */
     invertChange?: boolean;
     delay?: number;
}

export const StatCard = ({ title, value, sub, icon, tone = "blue", info, href, linkLabel = "View list", change, changeLabel, invertChange, delay = 0 }: StatCardProps) => {
     const t = TONES[tone];
     const body = (
          <div className={`group relative h-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 p-5 transition-all duration-300 ${t.ring} ${href ? "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30" : ""}`}>
               <div className={`pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br ${t.glow} to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />
               <div className="relative flex items-start justify-between gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${t.icon}`}>{icon}</div>
                    {info && <InfoTip title={title}>{info}</InfoTip>}
               </div>
               <p className="relative mt-4 text-sm font-medium text-gray-400">{title}</p>
               <p className="relative mt-1 text-2xl md:text-[1.7rem] font-bold tracking-tight text-white tabular-nums">{value}</p>
               <div className="relative mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {change !== undefined && <ChangePill change={change} invert={invertChange} />}
                    {changeLabel && <span>{changeLabel}</span>}
                    {sub && <span>{sub}</span>}
               </div>
               {href && (
                    <span className={`relative mt-3 inline-flex items-center gap-1 text-xs font-medium ${t.text} opacity-80 group-hover:opacity-100`}>
                         {linkLabel} <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
               )}
          </div>
     );
     return (
          <Reveal delay={delay} className="h-full">
               {href ? <Link href={href} className="block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">{body}</Link> : body}
          </Reveal>
     );
};

export const ChangePill = ({ change, invert }: { change: number | null; invert?: boolean }) => {
     if (change === null) return <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 font-semibold text-blue-300">New</span>;
     const flat = Math.abs(change) < 0.05;
     const good = invert ? change < 0 : change > 0;
     const cls = flat ? "bg-gray-700/40 text-gray-300" : good ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300";
     const Icon = flat ? Minus : change > 0 ? TrendingUp : TrendingDown;
     return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${cls}`}>
               <Icon size={11} /> {change > 0 ? "+" : ""}{change.toFixed(1)}%
          </span>
     );
};

/** Card container for charts, tables and lists. */
export const Panel = ({ title, subtitle, info, action, children, className = "", delay = 0 }: { title: string; subtitle?: string; info?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string; delay?: number }) => (
     <Reveal delay={delay} className={className}>
          <section className="h-full rounded-2xl border border-gray-800 bg-gray-900/80 p-5 md:p-6">
               <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div>
                         <div className="flex items-center gap-1.5">
                              <h3 className="text-base font-semibold text-white">{title}</h3>
                              {info && <InfoTip title={title} align="left">{info}</InfoTip>}
                         </div>
                         {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
                    </div>
                    {action}
               </header>
               {children}
          </section>
     </Reveal>
);

export const PageHeader = ({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children?: React.ReactNode }) => (
     <Reveal className="relative z-30">
          <div className="relative rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950/60 p-6 md:p-7">
               {/* Glow is clipped on its own layer so dropdowns in the header (date picker) are never cut off */}
               <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute -right-16 -top-20 size-64 rounded-full bg-blue-600/10 blur-3xl" />
               </div>
               <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex items-start gap-4">
                         <div className="size-12 shrink-0 rounded-2xl bg-blue-500/15 text-blue-300 flex items-center justify-center">{icon}</div>
                         <div>
                              <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
                              <p className="mt-1 max-w-2xl text-sm text-gray-400">{description}</p>
                         </div>
                    </div>
                    {children}
               </div>
          </div>
     </Reveal>
);

export const EmptyState = ({ icon, title, text, action }: { icon: React.ReactNode; title: string; text?: string; action?: React.ReactNode }) => (
     <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 px-6 py-14 text-center">
          <div className="mb-1 size-12 rounded-2xl bg-gray-800 text-gray-400 flex items-center justify-center">{icon}</div>
          <p className="text-sm font-semibold text-gray-200">{title}</p>
          {text && <p className="max-w-sm text-xs text-gray-500">{text}</p>}
          {action}
     </div>
);
