import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Numbered pagination that keeps every other filter in the URL. */
export const Pagination = ({ page, totalPages, total, pageSize, search, itemLabel = "items" }: { page: number; totalPages: number; total: number; pageSize: number; search: Record<string, string | undefined>; itemLabel?: string }) => {
     if (total === 0) return null;
     const href = (p: number) => {
          const params = new URLSearchParams();
          for (const [k, v] of Object.entries(search)) if (v && k !== "page") params.set(k, v);
          if (p > 1) params.set("page", String(p));
          const qs = params.toString();
          return qs ? `?${qs}` : "?";
     };
     const start = (page - 1) * pageSize + 1;
     const end = Math.min(page * pageSize, total);

     const pages: (number | "…")[] = [];
     for (let p = 1; p <= totalPages; p++) {
          if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
          else if (pages[pages.length - 1] !== "…") pages.push("…");
     }

     const btn = "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition-colors";
     return (
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
               <p className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-300">{start.toLocaleString()}–{end.toLocaleString()}</span> of <span className="font-medium text-gray-300">{total.toLocaleString()}</span> {itemLabel}
               </p>
               {totalPages > 1 && (
                    <nav className="flex items-center gap-1" aria-label="Pagination">
                         {page > 1 ? <Link href={href(page - 1)} className={`${btn} text-gray-300 hover:bg-gray-800`} aria-label="Previous page"><ChevronLeft size={16} /></Link> : <span className={`${btn} text-gray-700`}><ChevronLeft size={16} /></span>}
                         {pages.map((p, i) =>
                              p === "…" ? <span key={`gap-${i}`} className="px-1 text-gray-600">…</span> : (
                                   <Link key={p} href={href(p)} aria-current={p === page ? "page" : undefined} className={`${btn} ${p === page ? "bg-blue-600 font-semibold text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>{p}</Link>
                              )
                         )}
                         {page < totalPages ? <Link href={href(page + 1)} className={`${btn} text-gray-300 hover:bg-gray-800`} aria-label="Next page"><ChevronRight size={16} /></Link> : <span className={`${btn} text-gray-700`}><ChevronRight size={16} /></span>}
                    </nav>
               )}
          </div>
     );
};

export const parsePaging = (search: Record<string, string | undefined>, fallbackSize = 25) => {
     const size = [10, 12, 24, 25, 48, 50, 100].includes(Number(search.size)) ? Number(search.size) : fallbackSize;
     const page = Math.max(1, parseInt(search.page ?? "1") || 1);
     return { page, size, skip: (page - 1) * size };
};
