"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronDown, Loader2, Search, X, RotateCcw } from "lucide-react";
import { RANGE_PRESETS, toKigaliDateStr } from "@/lib/admin/date-range";

/** Updates URL search params (which re-runs the server query) and always resets to page 1. */
function useParamUpdater() {
     const router = useRouter();
     const pathname = usePathname();
     const params = useSearchParams();
     const [pending, startTransition] = useTransition();
     const update = (changes: Record<string, string | null | undefined>) => {
          const next = new URLSearchParams(params.toString());
          for (const [k, v] of Object.entries(changes)) {
               if (v === null || v === undefined || v === "") next.delete(k);
               else next.set(k, v);
          }
          if (!("page" in changes)) next.delete("page");
          const qs = next.toString();
          startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
     };
     return { params, update, pending };
}

const fieldCls = "h-10 rounded-xl border border-gray-700 bg-gray-900 px-3 text-sm text-gray-200 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export const DateRangeFilter = ({ defaultPreset = "30d", label = "Period", allowAll = true }: { defaultPreset?: string; label?: string; allowAll?: boolean }) => {
     const { params, update, pending } = useParamUpdater();
     const [open, setOpen] = useState(false);
     const ref = useRef<HTMLDivElement>(null);
     const from = params.get("from") ?? "";
     const to = params.get("to") ?? "";
     const isCustom = !!(from || to);
     const preset = isCustom ? "custom" : params.get("range") ?? defaultPreset;
     const [draftFrom, setDraftFrom] = useState(from);
     const [draftTo, setDraftTo] = useState(to);
     const today = toKigaliDateStr(new Date());

     useEffect(() => { setDraftFrom(from); setDraftTo(to); }, [from, to]);
     useEffect(() => {
          if (!open) return;
          const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
          document.addEventListener("mousedown", close);
          return () => document.removeEventListener("mousedown", close);
     }, [open]);

     const presets = RANGE_PRESETS.filter((p) => allowAll || p.value !== "all");
     const current = preset === "custom"
          ? `${from || "Start"} → ${to || "Today"}`
          : presets.find((p) => p.value === preset)?.label ?? "Custom";

     return (
          <div ref={ref} className="relative">
               <button type="button" onClick={() => setOpen((o) => !o)} className={`${fieldCls} inline-flex items-center gap-2 hover:border-gray-500 min-w-[190px] justify-between`}>
                    <span className="inline-flex items-center gap-2">
                         {pending ? <Loader2 size={15} className="animate-spin text-blue-400" /> : <CalendarDays size={15} className="text-blue-400" />}
                         <span className="text-gray-500">{label}:</span>
                         <span className="font-medium text-white">{current}</span>
                    </span>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
               </button>
               <AnimatePresence>
                    {open && (
                         <motion.div
                              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                              className="absolute right-0 z-40 mt-2 w-[min(92vw,340px)] rounded-2xl border border-gray-700 bg-gray-950 p-4 shadow-2xl"
                         >
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Quick select</p>
                              <div className="grid grid-cols-2 gap-1.5">
                                   {presets.map((p) => (
                                        <button
                                             key={p.value}
                                             type="button"
                                             onClick={() => { update({ range: p.value === defaultPreset ? null : p.value, from: null, to: null }); setOpen(false); }}
                                             className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${preset === p.value ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-300 hover:bg-gray-800"}`}
                                        >
                                             {p.label}
                                        </button>
                                   ))}
                              </div>
                              <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Custom dates</p>
                              <div className="grid grid-cols-2 gap-2">
                                   <label className="flex flex-col gap-1 text-xs text-gray-400">From
                                        <input type="date" max={draftTo || today} value={draftFrom} onChange={(e) => setDraftFrom(e.target.value)} className={`${fieldCls} [color-scheme:dark]`} />
                                   </label>
                                   <label className="flex flex-col gap-1 text-xs text-gray-400">To
                                        <input type="date" min={draftFrom || undefined} max={today} value={draftTo} onChange={(e) => setDraftTo(e.target.value)} className={`${fieldCls} [color-scheme:dark]`} />
                                   </label>
                              </div>
                              <button
                                   type="button"
                                   disabled={!draftFrom && !draftTo}
                                   onClick={() => { update({ range: null, from: draftFrom || null, to: draftTo || null }); setOpen(false); }}
                                   className="mt-3 h-10 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                   Apply dates
                              </button>
                         </motion.div>
                    )}
               </AnimatePresence>
          </div>
     );
};

export const SearchBox = ({ placeholder = "Search...", param = "q" }: { placeholder?: string; param?: string }) => {
     const { params, update, pending } = useParamUpdater();
     const initial = params.get(param) ?? "";
     const [value, setValue] = useState(initial);
     const first = useRef(true);

     useEffect(() => { setValue(params.get(param) ?? ""); }, [params, param]);
     useEffect(() => {
          if (first.current) { first.current = false; return; }
          if (value.trim() === (params.get(param) ?? "")) return;
          const id = setTimeout(() => update({ [param]: value.trim() || null }), 400);
          return () => clearTimeout(id);
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [value]);

     return (
          <div className="relative flex-1 min-w-[220px]">
               {pending ? <Loader2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 animate-spin text-blue-400" /> : <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />}
               <input
                    type="search"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className={`${fieldCls} w-full pl-9 pr-9`}
               />
               {value && (
                    <button type="button" aria-label="Clear search" onClick={() => setValue("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-white">
                         <X size={14} />
                    </button>
               )}
          </div>
     );
};

export const SelectFilter = ({ param, label, options, allLabel = "All" }: { param: string; label: string; options: { value: string; label: string }[]; allLabel?: string }) => {
     const { params, update } = useParamUpdater();
     const value = params.get(param) ?? "";
     return (
          <label className="relative inline-flex items-center">
               <span className="sr-only">{label}</span>
               <select
                    value={value}
                    onChange={(e) => update({ [param]: e.target.value || null })}
                    className={`${fieldCls} appearance-none pr-9 ${value ? "border-blue-500/60 text-white" : ""}`}
               >
                    <option value="">{label}: {allLabel}</option>
                    {options.map((o) => <option key={o.value} value={o.value}>{label}: {o.label}</option>)}
               </select>
               <ChevronDown size={14} className="pointer-events-none absolute right-3 text-gray-500" />
          </label>
     );
};

/** Pill-style single-choice filter (e.g. status). */
export const ChipFilter = ({ param, options }: { param: string; options: { value: string; label: string; count?: number }[] }) => {
     const { params, update } = useParamUpdater();
     const value = params.get(param) ?? "";
     return (
          <div className="flex flex-wrap gap-1.5">
               {[{ value: "", label: "All" }, ...options].map((o) => {
                    const active = value === o.value;
                    return (
                         <button
                              key={o.value || "all"}
                              type="button"
                              onClick={() => update({ [param]: o.value || null })}
                              className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${active ? "text-white" : "text-gray-400 hover:text-white bg-gray-900 border border-gray-800"}`}
                         >
                              {active && <motion.span layoutId={`chip-${param}`} className="absolute inset-0 rounded-full bg-blue-600" transition={{ type: "spring", duration: 0.4 }} />}
                              <span className="relative">{o.label}{"count" in o && o.count !== undefined ? <span className="ml-1.5 opacity-70">{o.count}</span> : null}</span>
                         </button>
                    );
               })}
          </div>
     );
};

export const ClearFilters = ({ keys }: { keys: string[] }) => {
     const { params, update } = useParamUpdater();
     if (!keys.some((k) => params.get(k))) return null;
     return (
          <button type="button" onClick={() => update(Object.fromEntries(keys.map((k) => [k, null])))} className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
               <RotateCcw size={14} /> Clear filters
          </button>
     );
};

export const PageSizeSelect = ({ sizes = [10, 25, 50, 100], fallback = 25 }: { sizes?: number[]; fallback?: number }) => {
     const { params, update } = useParamUpdater();
     const value = params.get("size") ?? String(fallback);
     return (
          <label className="inline-flex items-center gap-2 text-xs text-gray-500">
               Rows per page
               <select value={value} onChange={(e) => update({ size: e.target.value === String(fallback) ? null : e.target.value })} className="h-8 rounded-lg border border-gray-700 bg-gray-900 px-2 text-xs text-gray-200 outline-none focus:border-blue-500">
                    {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
               </select>
          </label>
     );
};
