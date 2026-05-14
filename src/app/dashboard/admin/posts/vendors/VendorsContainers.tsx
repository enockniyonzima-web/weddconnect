"use client";

import { AdminVendorCard } from "./VendorCard";
import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { countVendors, fetchVendors } from "@/server-actions/vendor.actions";
import { SVendorCard } from "@/select-types/vendor";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function VendorsContainer() {
     const perPage = 12;
     const [page, setPage] = useState(1);
     const [search, setSearch] = useState("");
     const [debouncedSearch, setDebouncedSearch] = useState("");
     const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

     const handleSearch = useCallback((value: string) => {
          setSearch(value);
          setPage(1);
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => setDebouncedSearch(value), 350);
     }, []);

     useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

     const searchFilter = debouncedSearch.trim()
          ? { OR: [
               { name: { contains: debouncedSearch, mode: "insensitive" as const } },
               { user: { email: { contains: debouncedSearch, mode: "insensitive" as const } } },
            ]}
          : undefined;

     const { data: vendors, isLoading: fetchingVendors, isFetching } = useQuery({
          queryKey: ["admin-vendors", page, debouncedSearch],
          queryFn: () => fetchVendors(SVendorCard, searchFilter, perPage, (page - 1) * perPage),
     });

     const { data: total } = useQuery({
          queryKey: ["admin-vendors-total", debouncedSearch],
          queryFn: () => countVendors(searchFilter),
     });

     const totalPages = total ? Math.ceil(total / perPage) : 1;
     const isEmpty = !fetchingVendors && (!vendors || vendors.length === 0);

     return (
          <div className="flex flex-col gap-5 w-full">
               {/* Toolbar */}
               <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                         <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                         <input
                              type="text"
                              value={search}
                              onChange={(e) => handleSearch(e.target.value)}
                              placeholder="Search by name or email…"
                              className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-600/50 focus:ring-1 focus:ring-blue-600/20 transition-colors"
                         />
                    </div>

                    {/* Count badge */}
                    {total !== undefined && (
                         <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-xs text-gray-400">
                              <Users size={13} />
                              <span><span className="text-white font-medium">{total}</span> vendors</span>
                         </div>
                    )}
               </div>

               {/* Grid */}
               <div className={cn("relative w-full transition-opacity duration-200", isFetching && "opacity-50 pointer-events-none")}>
                    {fetchingVendors ? (
                         <VendorGridSkeleton />
                    ) : isEmpty ? (
                         <EmptyVendors search={debouncedSearch} />
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {vendors!.map((vendor, i) => (
                                   <AdminVendorCard vendor={vendor} index={(page - 1) * perPage + i + 1} key={vendor.id} />
                              ))}
                         </div>
                    )}
                    {/* Refetch overlay spinner */}
                    {isFetching && !fetchingVendors && (
                         <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/90 border border-gray-800 text-xs text-gray-400 backdrop-blur-sm">
                                   <svg className="h-3.5 w-3.5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                   </svg>
                                   Updating…
                              </div>
                         </div>
                    )}
               </div>

               {/* Pagination */}
               {!isEmpty && totalPages > 1 && (
                    <div className="flex items-center justify-between pt-1">
                         <button
                              disabled={page === 1}
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-800 bg-gray-900 text-xs text-gray-400 hover:border-gray-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                         >
                              <ChevronLeft size={13} /> Previous
                         </button>
                         <span className="text-xs text-gray-600">
                              Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
                         </span>
                         <button
                              disabled={page >= totalPages}
                              onClick={() => setPage((p) => p + 1)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-800 bg-gray-900 text-xs text-gray-400 hover:border-gray-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                         >
                              Next <ChevronRight size={13} />
                         </button>
                    </div>
               )}
          </div>
     );
}

const VendorGridSkeleton = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
               <div key={i} className="h-36 rounded-2xl bg-gray-900 border border-gray-800 animate-pulse" />
          ))}
     </div>
);

const EmptyVendors = ({ search }: { search: string }) => (
     <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-gray-800">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gray-900 border border-gray-800 text-gray-600">
               <Users size={20} strokeWidth={1.5} />
          </div>
          <p className="text-sm text-gray-500">
               {search ? `No vendors matching "${search}"` : "No vendors found"}
          </p>
     </div>
);
