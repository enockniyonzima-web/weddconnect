
"use client";

import { SearchInput } from "@/components/ui/forms/text-input";
import { SlidersHorizontal, X } from "lucide-react";
import { useRef, useState } from "react";

export interface FilterState {
     search: string;
     location: string;
}

interface FilterProps {
     onChange: (filters: FilterState) => void;
}

const Filter = ({ onChange }: FilterProps) => {
     const [filters, setFilters] = useState<FilterState>({ search: "", location: "" });
     const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

     const update = (patch: Partial<FilterState>) => {
          const next = { ...filters, ...patch };
          setFilters(next);
          clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => onChange(next), 300);
     };

     const hasActiveFilters = filters.search || filters.location;

     const reset = () => {
          const cleared: FilterState = { search: "",  location: "" };
          setFilters(cleared);
          onChange(cleared);
     };

     return (
          <div className="w-full bg-black border-b border-gray-900">
               <div className="px-[5%] py-4 flex flex-col gap-3">
                    {/* Top row */}
                    <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1.5 text-gray-400">
                              <SlidersHorizontal size={14} strokeWidth={2} />
                              <span className="text-xs font-semibold uppercase tracking-wider">Filter</span>
                         </div>
                         {hasActiveFilters && (
                              <button
                                   type="button"
                                   onClick={reset}
                                   className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
                              >
                                   <X size={12} strokeWidth={2} /> Clear all
                              </button>
                         )}
                    </div>

                    {/* Inputs row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                         <SearchInput
                              name="search"
                              placeholder="Search vendors…"
                              value={filters.search}
                              action={(v) => update({ search: v })}
                         />

                         <SearchInput
                              name="location"
                              placeholder="Filter by location…"
                              value={filters.location}
                              action={(v) => update({ location: v })}
                         />
                    </div>
               </div>
          </div>
     );
};

export default Filter;
