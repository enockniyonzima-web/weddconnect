"use client";

import { SPost } from "@/common/Entities";
import { countPosts, fetchPosts } from "@/server-actions/post.actions";
import { fetchCategories } from "@/server-actions/category.actions";
import { SCategorySimple } from "@/select-types/category";
import { useQuery } from "@tanstack/react-query";
import Filter, { FilterState } from "./Filter";
import PostsContainer from "./PostsContainer";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { useState, useMemo } from "react";

const PAGE_SIZE = 12;

export default function CategoryPostContainer({
     categoryId,
     onBack,
}: {
     categoryId: number;
     onBack: () => void;
}) {
     const [page, setPage] = useState(0);
     const [filters, setFilters] = useState<FilterState>({ search: "", location: "" });

     // build where clause
     const where = useMemo(() => ({
          status: "published",
          categoryId,
          ...(filters.search ? {
               OR: [
                    { title: { contains: filters.search, mode: "insensitive" as const } },
                    { vendor: { name: { contains: filters.search, mode: "insensitive" as const } } },
               ],
          } : {}),
          ...(filters.location ? { location: { contains: filters.location, mode: "insensitive" as const } } : {}),
     }), [categoryId, filters]);

     const { data: posts, isLoading } = useQuery({
          queryKey: ["posts", categoryId, filters, page],
          queryFn: () => fetchPosts(SPost, where, PAGE_SIZE, page * PAGE_SIZE),
     });

     const { data: total = 0 } = useQuery({
          queryKey: ["posts-count", categoryId, filters],
          queryFn: () => countPosts(where),
     });

     const { data: categoryInfo } = useQuery({
          queryKey: ["category-info", categoryId],
          queryFn: () => fetchCategories(SCategorySimple, { id: categoryId }, 1),
          select: (d) => d[0],
     });

     const totalPages = Math.ceil(total / PAGE_SIZE);

     const handleFilterChange = (f: FilterState) => {
          setFilters(f);
          setPage(0);
     };

     return (
          <div className="w-full min-h-screen bg-black">
               <div className="w-full max-w-7xl mx-auto">
                    {/* Header */}
               <div className="relative w-full px-[5%] pt-24 pb-8 border-b border-gray-900 overflow-hidden">
                    <div className="pointer-events-none absolute inset-0">
                         <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-blue-600/6 blur-3xl" />
                    </div>
                    <div className="relative flex flex-col gap-4">
                         <button
                              type="button"
                              onClick={onBack}
                              className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors cursor-pointer w-fit"
                         >
                              <ArrowLeft size={15} strokeWidth={2} />
                              All categories
                         </button>
                         <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div>
                                   <h1 className="text-3xl md:text-4xl font-bold text-white">
                                        {categoryInfo?.name ?? "Vendors"}
                                   </h1>
                                   <p className="text-gray-500 mt-1 text-sm">
                                        {total > 0 ? `${total} listing${total !== 1 ? "s" : ""} available` : "Explore our vendors"}
                                   </p>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900 text-gray-400 text-xs">
                                   <LayoutGrid size={13} strokeWidth={2} />
                                   {total} results
                              </div>
                         </div>
                    </div>
               </div>

               {/* Filter */}
               <Filter onChange={handleFilterChange} />

               {/* Posts grid */}
               <div className="w-full px-[5%] py-8">
                    <PostsContainer posts={posts ?? []} isLoading={isLoading} />

                    {/* Pagination */}
                    {totalPages > 1 && (
                         <div className="flex items-center justify-center gap-3 mt-10">
                              <button
                                   type="button"
                                   disabled={page === 0}
                                   onClick={() => setPage((p) => p - 1)}
                                   className="px-4 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-400 hover:text-white hover:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                   ← Previous
                              </button>
                              <span className="text-sm text-gray-500">
                                   Page <span className="text-white font-medium">{page + 1}</span> of <span className="text-white font-medium">{totalPages}</span>
                              </span>
                              <button
                                   type="button"
                                   disabled={page >= totalPages - 1}
                                   onClick={() => setPage((p) => p + 1)}
                                   className="px-4 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-400 hover:text-white hover:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                   Next →
                              </button>
                         </div>
                    )}
               </div>
               </div>
               
          </div>
     );
}
