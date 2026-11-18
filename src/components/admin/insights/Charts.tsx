"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";

const compact = (n: number) => {
     const a = Math.abs(n);
     if (a >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
     if (a >= 1_000) return `${(n / 1_000).toFixed(a >= 10_000 ? 0 : 1).replace(/\.0$/, "")}K`;
     return String(Math.round(n));
};
const full = (n: number) => Math.round(n).toLocaleString("en-US");
const fullMoney = (n: number) => `Rwf ${full(n)}`;

const niceMax = (v: number) => {
     if (v <= 0) return 1;
     const pow = 10 ** Math.floor(Math.log10(v));
     const n = v / pow;
     return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
};

/**
 * Column chart with a smooth trend line. Each column is hoverable/tappable to read its exact value.
 * `valueLabel` formats the main value (e.g. money); `countLabel` describes the secondary count.
 */
export const TrendChart = ({ data: raw, valuePrefix = "Rwf", countLabel = "payments", color = "#60a5fa", height = 240, countOnly, emptyText = "No payments received in this period" }: { data: { key: string; label: string; revenue: number; count: number }[]; valuePrefix?: string; countLabel?: string; color?: string; height?: number; countOnly?: boolean; emptyText?: string }) => {
     const [hover, setHover] = useState<number | null>(null);
     const data = countOnly ? raw.map((d) => ({ ...d, revenue: d.count })) : raw;
     const max = niceMax(Math.max(0, ...data.map((d) => d.revenue)));
     const ticks = [1, 0.75, 0.5, 0.25, 0];
     const n = data.length;
     const labelEvery = Math.max(1, Math.ceil(n / 8));
     const points = data.map((d, i) => `${((i + 0.5) / n) * 100},${100 - (d.revenue / max) * 100}`).join(" ");
     const empty = data.every((d) => d.revenue === 0);

     return (
          <div className="w-full">
               <div className="relative flex" style={{ height }}>
                    <div className="flex w-12 shrink-0 flex-col justify-between pb-6 pr-2 text-right text-[10px] text-gray-500 tabular-nums">
                         {ticks.map((t) => <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">{compact(max * t)}</span>)}
                    </div>
                    <div className="relative flex-1">
                         <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between">
                              {ticks.map((t) => <div key={t} className="border-t border-dashed border-gray-800" />)}
                         </div>
                         <div className="absolute inset-x-0 top-0 bottom-6 flex items-end">
                              {data.map((d, i) => {
                                   const pct = (d.revenue / max) * 100;
                                   const active = hover === i;
                                   return (
                                        <div
                                             key={d.key}
                                             className="relative flex h-full flex-1 items-end justify-center px-[2px] cursor-pointer"
                                             onMouseEnter={() => setHover(i)}
                                             onMouseLeave={() => setHover(null)}
                                             onClick={() => setHover(active ? null : i)}
                                        >
                                             {active && <div className="absolute inset-y-0 inset-x-0 rounded-md bg-white/[0.03]" />}
                                             <motion.div
                                                  className="w-full max-w-[34px] rounded-t-md"
                                                  style={{ background: `linear-gradient(to top, ${color}33, ${color}${active ? "ee" : "99"})` }}
                                                  initial={{ height: 0 }}
                                                  animate={{ height: `${d.revenue > 0 ? Math.max(pct, 1.5) : 0}%` }}
                                                  transition={{ duration: 0.6, delay: Math.min(i * 0.02, 0.4), ease: "easeOut" }}
                                             />
                                             {active && (
                                                  <motion.div
                                                       initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                                                       className={`pointer-events-none absolute bottom-full z-20 mb-2 whitespace-nowrap rounded-xl border border-gray-700 bg-gray-950 px-3 py-2 text-xs shadow-xl ${i > n / 2 ? "right-0" : "left-0"}`}
                                                  >
                                                       <p className="font-semibold text-white">{d.label}</p>
                                                       {countOnly ? <p className="text-gray-300">{d.count} {countLabel}</p> : (
                                                            <>
                                                                 <p className="text-gray-300">{valuePrefix} {full(d.revenue)}</p>
                                                                 <p className="text-gray-500">{d.count} {countLabel}</p>
                                                            </>
                                                       )}
                                                  </motion.div>
                                             )}
                                        </div>
                                   );
                              })}
                         </div>
                         {!empty && n > 1 && (
                              <svg className="pointer-events-none absolute inset-x-0 top-0 bottom-6 h-[calc(100%-1.5rem)] w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                   <motion.polyline
                                        points={points}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth={2}
                                        vectorEffect="non-scaling-stroke"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 0.9 }}
                                        transition={{ duration: 0.9, ease: "easeOut" }}
                                   />
                              </svg>
                         )}
                         <div className="absolute inset-x-0 bottom-0 flex h-6 items-end">
                              {data.map((d, i) => (
                                   <span key={d.key} className="flex-1 truncate text-center text-[10px] text-gray-500">{i % labelEvery === 0 ? d.label : ""}</span>
                              ))}
                         </div>
                         {empty && <div className="absolute inset-0 bottom-6 flex items-center justify-center text-sm text-gray-500">{emptyText}</div>}
                    </div>
               </div>
          </div>
     );
};

/** Donut with legend. Segments animate in; hovering a legend row highlights its slice. */
export const DonutChart = ({ data, centerLabel, centerValue, money }: { data: { label: string; value: number; color: string; sub?: string; href?: string }[]; centerLabel: string; centerValue: string; money?: boolean }) => {
     const format = money ? fullMoney : full;
     const [hover, setHover] = useState<number | null>(null);
     const total = data.reduce((s, d) => s + d.value, 0);
     const r = 42, c = 2 * Math.PI * r;
     let offset = 0;

     return (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
               <div className="relative size-44 shrink-0">
                    <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                         <circle cx="50" cy="50" r={r} fill="none" stroke="#1f2937" strokeWidth="11" />
                         {total > 0 && data.map((d, i) => {
                              const len = (d.value / total) * c;
                              const seg = (
                                   <motion.circle
                                        key={d.label}
                                        cx="50" cy="50" r={r} fill="none" stroke={d.color}
                                        strokeWidth={hover === i ? 13 : 11}
                                        strokeDasharray={`${len} ${c - len}`}
                                        strokeDashoffset={-offset}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: hover === null || hover === i ? 1 : 0.35 }}
                                        transition={{ duration: 0.4, delay: i * 0.08 }}
                                        onMouseEnter={() => setHover(i)}
                                        onMouseLeave={() => setHover(null)}
                                   />
                              );
                              offset += len;
                              return seg;
                         })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                         <span className="text-xl font-bold text-white tabular-nums">{hover !== null ? format(data[hover].value) : centerValue}</span>
                         <span className="max-w-[90px] text-[11px] leading-tight text-gray-500">{hover !== null ? data[hover].label : centerLabel}</span>
                    </div>
               </div>
               <ul className="flex w-full flex-col gap-1.5">
                    {data.map((d, i) => {
                         const pct = total ? (d.value / total) * 100 : 0;
                         const row = (
                              <div className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 transition-colors ${hover === i ? "bg-gray-800/70" : ""} ${d.href ? "hover:bg-gray-800/70" : ""}`}>
                                   <span className="flex min-w-0 items-center gap-2 text-sm text-gray-300">
                                        <span className="size-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                                        <span className="truncate">{d.label}</span>
                                   </span>
                                   <span className="shrink-0 text-right">
                                        <span className="text-sm font-semibold text-white tabular-nums">{format(d.value)}</span>
                                        <span className="ml-2 text-xs text-gray-500 tabular-nums">{pct.toFixed(0)}%</span>
                                        {d.sub && <span className="block text-[11px] text-gray-500">{d.sub}</span>}
                                   </span>
                              </div>
                         );
                         return (
                              <li key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                                   {d.href ? <Link href={d.href}>{row}</Link> : row}
                              </li>
                         );
                    })}
                    {data.length === 0 && <li className="text-sm text-gray-500">Nothing to show for this period</li>}
               </ul>
          </div>
     );
};

/** Ranked horizontal bars. */
export const BarList = ({ data, color = "#60a5fa", money, empty = "Nothing to show for this period" }: { data: { label: string; value: number; sub?: string; href?: string }[]; color?: string; money?: boolean; empty?: string }) => {
     const format = money ? fullMoney : full;
     const max = Math.max(1, ...data.map((d) => d.value));
     if (data.length === 0) return <p className="py-6 text-center text-sm text-gray-500">{empty}</p>;
     return (
          <ul className="flex flex-col gap-3">
               {data.map((d, i) => {
                    const inner = (
                         <div className="group">
                              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                                   <span className="truncate font-medium text-gray-300 group-hover:text-white">{d.label}</span>
                                   <span className="shrink-0 font-semibold text-white tabular-nums">{format(d.value)}{d.sub && <span className="ml-2 text-xs font-normal text-gray-500">{d.sub}</span>}</span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                                   <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${(d.value / max) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }} />
                              </div>
                         </div>
                    );
                    return <li key={d.label}>{d.href ? <Link href={d.href}>{inner}</Link> : inner}</li>;
               })}
          </ul>
     );
};
