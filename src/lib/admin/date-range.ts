// Shared (client + server) date-range helpers for admin reports.
// All day boundaries are computed in Kigali time (UTC+2, no daylight saving) so a "day" in a
// report matches the operator's calendar regardless of the server's timezone.

const KIGALI_OFFSET_MS = 2 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const RANGE_PRESETS = [
     { value: "today", label: "Today" },
     { value: "7d", label: "Last 7 days" },
     { value: "30d", label: "Last 30 days" },
     { value: "90d", label: "Last 90 days" },
     { value: "month", label: "This month" },
     { value: "last-month", label: "Last month" },
     { value: "year", label: "This year" },
     { value: "all", label: "All time" },
] as const;

export type RangePreset = (typeof RANGE_PRESETS)[number]["value"] | "custom";
export type Granularity = "day" | "week" | "month";

export interface ResolvedRange {
     preset: RangePreset;
     /** Inclusive start, or null for "all time". */
     from: Date | null;
     /** Exclusive end. */
     to: Date;
     /** yyyy-MM-dd strings (inclusive) for display / inputs. */
     fromStr: string | null;
     toStr: string;
     label: string;
     /** Same-length period right before this one, for comparisons. Null for "all time". */
     previous: { from: Date; to: Date; label: string } | null;
}

/** yyyy-MM-dd of a moment, in Kigali time. */
export const toKigaliDateStr = (d: Date) => new Date(d.getTime() + KIGALI_OFFSET_MS).toISOString().slice(0, 10);

/** Start of a Kigali calendar day (yyyy-MM-dd) as an absolute Date. */
export const kigaliDayStart = (dateStr: string) => new Date(`${dateStr}T00:00:00.000+02:00`);

export const addDaysStr = (dateStr: string, n: number) => {
     const d = new Date(`${dateStr}T00:00:00.000Z`);
     return new Date(d.getTime() + n * DAY_MS).toISOString().slice(0, 10);
};

const daysBetween = (a: string, b: string) => Math.round((new Date(`${b}T00:00:00Z`).getTime() - new Date(`${a}T00:00:00Z`).getTime()) / DAY_MS);

const fmtLabel = (s: string) => new Date(`${s}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export const isValidDateStr = (s?: string | null): s is string => !!s && DATE_RE.test(s) && !Number.isNaN(new Date(`${s}T00:00:00Z`).getTime());

export function resolveRange(params: { range?: string; from?: string; to?: string }, fallback: RangePreset = "30d", now = new Date()): ResolvedRange {
     const today = toKigaliDateStr(now);
     const tomorrow = addDaysStr(today, 1);
     let preset = (params.range as RangePreset) || fallback;
     let fromStr: string | null;
     let toStr = today; // inclusive

     if (isValidDateStr(params.from) || isValidDateStr(params.to)) preset = "custom";

     switch (preset) {
          case "today": fromStr = today; break;
          case "7d": fromStr = addDaysStr(today, -6); break;
          case "30d": fromStr = addDaysStr(today, -29); break;
          case "90d": fromStr = addDaysStr(today, -89); break;
          case "month": fromStr = `${today.slice(0, 7)}-01`; break;
          case "last-month": {
               const firstThis = `${today.slice(0, 7)}-01`;
               toStr = addDaysStr(firstThis, -1);
               fromStr = `${toStr.slice(0, 7)}-01`;
               break;
          }
          case "year": fromStr = `${today.slice(0, 4)}-01-01`; break;
          case "all": fromStr = null; break;
          case "custom": {
               fromStr = isValidDateStr(params.from) ? params.from : null;
               toStr = isValidDateStr(params.to) ? params.to : today;
               if (fromStr && fromStr > toStr) [fromStr, toStr] = [toStr, fromStr];
               break;
          }
          default:
               return resolveRange({ range: fallback }, fallback, now);
     }

     const from = fromStr ? kigaliDayStart(fromStr) : null;
     const to = toStr === today ? kigaliDayStart(tomorrow) : kigaliDayStart(addDaysStr(toStr, 1));
     const presetLabel = RANGE_PRESETS.find((p) => p.value === preset)?.label;
     const label = preset === "custom" || !presetLabel
          ? (fromStr ? `${fmtLabel(fromStr)} – ${fmtLabel(toStr)}` : `Up to ${fmtLabel(toStr)}`)
          : presetLabel;

     let previous: ResolvedRange["previous"] = null;
     if (fromStr) {
          const len = daysBetween(fromStr, toStr) + 1;
          const prevTo = addDaysStr(fromStr, -1);
          const prevFrom = addDaysStr(fromStr, -len);
          previous = { from: kigaliDayStart(prevFrom), to: kigaliDayStart(fromStr), label: `${fmtLabel(prevFrom)} – ${fmtLabel(prevTo)}` };
     }

     return { preset, from, to, fromStr, toStr, label, previous };
}

/** Prisma-style date filter for a resolved range (end exclusive). */
export const rangeFilter = (r: { from: Date | null; to: Date }) => (r.from ? { gte: r.from, lt: r.to } : { lt: r.to });

export const pickGranularity = (fromStr: string, toStr: string): Granularity => {
     const span = daysBetween(fromStr, toStr) + 1;
     if (span <= 45) return "day";
     if (span <= 200) return "week";
     return "month";
};

/** Bucket key of a moment for the given granularity, in Kigali time. */
export const bucketKey = (d: Date, g: Granularity) => {
     const s = toKigaliDateStr(d);
     if (g === "day") return s;
     if (g === "month") return s.slice(0, 7);
     const dow = new Date(`${s}T00:00:00Z`).getUTCDay(); // 0 = Sunday
     return addDaysStr(s, -((dow + 6) % 7)); // Monday of that week
};

/** Every bucket between two inclusive yyyy-MM-dd dates, with a human label. */
export const buildBuckets = (fromStr: string, toStr: string, g: Granularity) => {
     const out: { key: string; label: string }[] = [];
     const seen = new Set<string>();
     for (let s = fromStr; s <= toStr; s = addDaysStr(s, g === "month" ? 27 : 1)) {
          const key = bucketKey(kigaliDayStart(s), g);
          if (seen.has(key)) continue;
          seen.add(key);
          const ref = new Date(`${g === "month" ? `${key}-01` : key}T12:00:00Z`);
          const label = g === "month"
               ? ref.toLocaleDateString("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" })
               : ref.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
          out.push({ key, label: g === "week" ? `Wk of ${label}` : label });
     }
     // Make sure the final month is present when stepping by 27 days skipped past it
     const lastKey = bucketKey(kigaliDayStart(toStr), g);
     if (!seen.has(lastKey)) {
          const ref = new Date(`${g === "month" ? `${lastKey}-01` : lastKey}T12:00:00Z`);
          out.push({ key: lastKey, label: ref.toLocaleDateString("en-GB", g === "month" ? { month: "short", year: "2-digit", timeZone: "UTC" } : { day: "numeric", month: "short", timeZone: "UTC" }) });
     }
     return out;
};

/** Query-string params that carry a range through links (e.g. stat card → filtered list). */
export const rangeParams = (r: ResolvedRange) => {
     const p: Record<string, string> = {};
     if (r.preset === "custom") {
          if (r.fromStr) p.from = r.fromStr;
          p.to = r.toStr;
     } else {
          p.range = r.preset;
     }
     return p;
};

export const percentChange = (current: number, previous: number): number | null => {
     if (previous === 0) return current === 0 ? 0 : null; // null = "new", no meaningful %
     return ((current - previous) / previous) * 100;
};
