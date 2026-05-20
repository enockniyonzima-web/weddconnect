"use client";

import Image from "@/components/ui/Image";
import { SFullCategory, TFullCategory } from "@/select-types/category";
import { SAdminPostCard } from "@/select-types/post";
import { fetchCategories } from "@/server-actions/category.actions";
import { fetchPosts } from "@/server-actions/post.actions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AdminPostCard } from "@/components/cards/admin/AdminPostCard";
import { ChevronRight, ImageIcon, LayoutGrid, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Main Container ───────────────────────────────────────────────────────────

export const AdminPostsContainer = () => {
     const { data: categoriesData, isLoading: fetchingCategories } = useQuery({
          queryKey: ["categories"],
          queryFn: () => fetchCategories(SFullCategory, undefined, 30),
     });

     const [categoryId, setCategoryId] = useState<number | null>(null);
     const [page, setPage] = useState(1);
     const [search, setSearch] = useState("");
     const perPage = 20;

     const selectedCategory = categoriesData?.find((c) => c.id === categoryId) ?? null;

     const where = categoryId
          ? { categoryId, ...(search.trim() ? { title: { contains: search.trim(), mode: "insensitive" as const } } : {}) }
          : undefined;

     const { data: postData, isLoading: fetchingPosts } = useQuery({
          queryKey: ["posts", categoryId, page, search],
          queryFn: () => categoryId ? fetchPosts(SAdminPostCard, where, perPage, (page - 1) * perPage) : undefined,
          enabled: !!categoryId,
     });

     const handleSelectCategory = (id: number) => {
          setCategoryId(id);
          setPage(1);
          setSearch("");
     };

     const categories = categoriesData ?? [];
     const posts = postData ? postData : [];

     return (
          <div className="flex flex-col gap-6 w-full">
               {/* Header */}
               <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400">
                         <LayoutGrid size={16} strokeWidth={2} />
                    </div>
                    <div>
                         <h2 className="text-base font-semibold text-white">Posts</h2>
                         <p className="text-xs text-gray-500">Browse and manage listings by category</p>
                    </div>
               </div>

               {/* Category selector — horizontal strip when one is selected */}
               {categoryId && categories.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                         <button
                              onClick={() => setCategoryId(null)}
                              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900 text-xs text-gray-400 hover:border-blue-600/50 hover:text-blue-400 transition-colors"
                         >
                              All categories
                         </button>
                         {categories.map((cat) => (
                              <button
                                   key={cat.id}
                                   onClick={() => handleSelectCategory(cat.id)}
                                   className={cn(
                                        "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                                        cat.id === categoryId
                                             ? "border-blue-600/40 bg-blue-600/10 text-blue-400"
                                             : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-white"
                                   )}
                              >
                                   {cat.name}
                                   <span className="text-[10px] text-gray-600">{cat._count?.posts ?? 0}</span>
                              </button>
                         ))}
                    </div>
               )}

               {/* Category grid — shown when no category selected */}
               {!categoryId && (
                    <div className="flex flex-col gap-3">
                         {fetchingCategories ? (
                              <CategoryGridSkeleton />
                         ) : (
                              categories.map((cat) => (
                                   <CategoryRow key={cat.id} category={cat} onSelect={handleSelectCategory} />
                              ))
                         )}
                    </div>
               )}

               {/* Posts grid */}
               {categoryId && (
                    <div className="flex flex-col gap-4">
                         {/* Selected category heading */}
                         {selectedCategory && (
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                   <div>
                                        <h3 className="text-sm font-semibold text-white">{selectedCategory.name}</h3>
                                        <p className="text-xs text-gray-500">{selectedCategory._count?.posts ?? 0} listings</p>
                                   </div>
                                   {/* Search */}
                                   <div className="relative flex items-center">
                                        <Search size={13} className="absolute left-2.5 text-gray-500 pointer-events-none" />
                                        <input
                                             type="text"
                                             value={search}
                                             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                             placeholder="Search posts..."
                                             className="pl-8 pr-8 py-1.5 text-xs rounded-lg border border-gray-800 bg-gray-900 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-600/50 w-48"
                                        />
                                        {search && (
                                             <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-2 text-gray-500 hover:text-white">
                                                  <X size={12} />
                                             </button>
                                        )}
                                   </div>
                              </div>
                         )}

                         {fetchingPosts ? (
                              <PostsGridSkeleton />
                         ) : posts.length === 0 ? (
                              <EmptyPosts />
                         ) : (
                              <>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {posts.map((post) => (
                                             <AdminPostCard key={post.id} post={post} />
                                        ))}
                                   </div>
                                   {/* Pagination */}
                                   <div className="flex items-center justify-between pt-2">
                                        <button
                                             disabled={page === 1}
                                             onClick={() => setPage((p) => Math.max(1, p - 1))}
                                             className="px-4 py-2 rounded-lg border border-gray-800 bg-gray-900 text-xs text-gray-400 hover:border-gray-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                             Previous
                                        </button>
                                        <span className="text-xs text-gray-600">Page {page}</span>
                                        <button
                                             disabled={posts.length < perPage}
                                             onClick={() => setPage((p) => p + 1)}
                                             className="px-4 py-2 rounded-lg border border-gray-800 bg-gray-900 text-xs text-gray-400 hover:border-gray-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                             Next
                                        </button>
                                   </div>
                              </>
                         )}
                    </div>
               )}
          </div>
     );
};

// ─── Category Row ─────────────────────────────────────────────────────────────

const CategoryRow = ({ category, onSelect }: { category: TFullCategory; onSelect: (id: number) => void }) => (
     <button
          type="button"
          onClick={() => onSelect(category.id)}
          className="group w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-800 bg-gray-900 hover:border-blue-600/40 hover:bg-gray-900/80 transition-all duration-200 text-left"
     >
          {/* Icon / Image */}
          <div className="shrink-0 relative h-14 w-14 rounded-xl overflow-hidden border border-gray-800 bg-gray-800">
               {category.icon ? (
                    <Image
                         src={category.icon}
                         alt={category.name}
                         className="w-full h-full object-cover"
                    />
               ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                         <ImageIcon size={20} strokeWidth={1.5} />
                    </div>
               )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
               <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                    {category.name}
               </h3>
               {category.description && (
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{category.description}</p>
               )}
               <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] text-gray-600">
                         <span className="text-blue-400 font-medium">{category._count?.posts ?? 0}</span> listings
                    </span>
                    <span className="text-[11px] text-gray-600">
                         <span className="text-gray-400 font-medium">{category.features.length}</span> features
                    </span>
               </div>
          </div>

          {/* Arrow */}
          <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg border border-gray-800 bg-gray-800 text-gray-500 group-hover:border-blue-600/40 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-all">
               <ChevronRight size={15} strokeWidth={2} />
          </div>
     </button>
);

// ─── Skeletons & Empty ────────────────────────────────────────────────────────

const CategoryGridSkeleton = () => (
     <>
          {[...Array(5)].map((_, i) => (
               <div key={i} className="w-full h-[82px] rounded-2xl bg-gray-900 border border-gray-800 animate-pulse" />
          ))}
     </>
);

const PostsGridSkeleton = () => (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
               <div key={i} className="w-full aspect-[3/4] rounded-2xl bg-gray-900 border border-gray-800 animate-pulse" />
          ))}
     </div>
);

const EmptyPosts = () => (
     <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-gray-800">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gray-900 border border-gray-800 text-gray-600">
               <ImageIcon size={20} strokeWidth={1.5} />
          </div>
          <p className="text-sm text-gray-500">No posts in this category yet</p>
     </div>
);
