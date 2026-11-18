// Money and date formatting for admin pages. The platform operates in Rwandan francs only.

const rwf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatRwf = (amount: number | null | undefined) => `Rwf ${rwf.format(Math.round(amount || 0))}`;

export const formatRwfCompact = (amount: number) => {
     const a = Math.abs(amount);
     if (a >= 1_000_000_000) return `Rwf ${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
     if (a >= 1_000_000) return `Rwf ${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
     if (a >= 10_000) return `Rwf ${(amount / 1_000).toFixed(0)}K`;
     return formatRwf(amount);
};

export const formatCount = (n: number) => rwf.format(n);

export const formatDate = (d: Date | string | null | undefined) =>
     d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Kigali" }) : "—";

export const formatDateTime = (d: Date | string | null | undefined) =>
     d ? new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kigali" }) : "—";

/** "in 5 days", "today", "3 days ago" relative to now. */
export const relativeDays = (d: Date | string) => {
     const diff = Math.round((new Date(d).getTime() - Date.now()) / 86_400_000);
     if (diff === 0) return "today";
     if (diff === 1) return "tomorrow";
     if (diff === -1) return "yesterday";
     return diff > 0 ? `in ${diff} days` : `${-diff} days ago`;
};
