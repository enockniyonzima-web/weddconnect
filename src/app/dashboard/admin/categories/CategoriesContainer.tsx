import { TCategory } from "@/common/Entities";
import Endpoints from "@/services/Endpoints";
import { MainServer } from "@/services/Server";
import CategoryFormButton from "./forms/CategoryFormButton";
import { FileText, Layers, ArrowUpDown, CheckCircle, XCircle } from "lucide-react";

import Link from "next/link";
import Image from "@/components/ui/Image";

export default async function CategoriesContainer({ search }: { search: Record<string, string | undefined> }) {
     const itemsPerPage = 12;
     let total = 0;
     let categories: TCategory[] = [];
     const currentPage = search.page ? parseInt(search.page) : 1;
     const searchStr = Object.entries(search).map(([key, value]) => `${key}=${value}`).join("&");
     const searchQuery = new URLSearchParams(searchStr).toString();
     const categoriesRes: { data: TCategory[]; pagination: { total: number } } = await MainServer.fetch(
          `${Endpoints.category.main}?${searchQuery}`
     );
     if (categoriesRes) {
          const { data, pagination } = categoriesRes;
          total = pagination.total;
          categories = data as TCategory[];
     }

     const totalPages = Math.ceil(total / itemsPerPage);
     const maxVisiblePages = 5;
     const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
     const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
     const showNext = currentPage < totalPages;
     const showPrev = currentPage > 1;

     return (
          <div className="w-full flex flex-col gap-5">
               {/* Stats Summary */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatBox label="Total" value={total} color="text-white" />
                    <StatBox label="Active" value={categories.filter((c) => c.status).length} color="text-green-400" />
                    <StatBox label="Total Posts" value={categories.reduce((sum, c) => sum + c._count.posts, 0)} color="text-blue-400" />
                    <StatBox label="Total Features" value={categories.reduce((sum, c) => sum + c.features.length, 0)} color="text-purple-400" />
               </div>

               {/* Categories Grid */}
               {categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {categories.map((category) => (
                              <CategoryCard key={category.id} category={category} />
                         ))}
                    </div>
               ) : (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                         <p className="text-gray-500">No categories found</p>
                    </div>
               )}

               {/* Pagination */}
               {totalPages > 1 && (
                    <div className="flex justify-center items-center py-4 space-x-2">
                         {showPrev && (
                              <Link href={`?page=${currentPage - 1}`} className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">Prev</Link>
                         )}
                         {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                              <Link key={page} href={`?page=${page}`} className={`px-4 py-2 rounded-lg text-sm transition-colors ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>{page}</Link>
                         ))}
                         {showNext && (
                              <Link href={`?page=${currentPage + 1}`} className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">Next</Link>
                         )}
                    </div>
               )}
          </div>
     );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
     return (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-1">
               <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
               <span className={`text-2xl font-bold ${color}`}>{value}</span>
          </div>
     );
}

function CategoryCard({ category }: { category: TCategory }) {
     return (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all group">
               {category.icon && (
                    <div className="relative w-full h-36 overflow-hidden">
                         <Image src={category.icon} alt={category.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                    </div>
               )}
               <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                         <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-100 truncate">{category.name}</h3>
                              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{category.description}</p>
                         </div>
                         <span className={`shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-full ${category.status ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                              {category.status ? <CheckCircle size={12} /> : <XCircle size={12} />}
                              {category.status ? "Active" : "Inactive"}
                         </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                         <span className="flex items-center gap-1.5"><FileText size={13} className="text-blue-400" />{category._count.posts} posts</span>
                         <span className="flex items-center gap-1.5"><Layers size={13} className="text-purple-400" />{category.features.length} features</span>
                         <span className="flex items-center gap-1.5"><ArrowUpDown size={13} className="text-yellow-400" />Rank {category.rank}</span>
                    </div>
                    {category.features.length > 0 && (
                         <div className="flex flex-wrap gap-1.5">
                              {category.features.slice(0, 4).map((f) => (
                                   <span key={f.id} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">{f.name}</span>
                              ))}
                              {category.features.length > 4 && (
                                   <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">+{category.features.length - 4} more</span>
                              )}
                         </div>
                    )}
                    <div className="pt-1">
                         <CategoryFormButton categoryId={category.id} size="sm" />
                    </div>
               </div>
          </div>
     );
}