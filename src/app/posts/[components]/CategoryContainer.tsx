"use client";

import { fetchCategories } from "@/server-actions/category.actions";
import { SCategory } from "@/select-types/category";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "@/components/ui/Image";
import { cn } from "@/lib/utils";

export default function CategoryContainer({ onCategorySelect }: { onCategorySelect: (id: number) => void }) {
     const { data: categoriesData, isLoading } = useQuery({
          queryKey: ["categories"],
          queryFn: () => fetchCategories(SCategory, { status: true }, 100),
     });
     const categories = categoriesData ?? [];

     return (
          <div className="min-h-screen w-full bg-black">
               <div className="w-full max-w-screen-xl mx-auto">
                    {/* Hero */}
                    <div className="relative w-full px-[5%] pt-24 pb-16 overflow-hidden">
                         <div className="pointer-events-none absolute inset-0">
                              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-3xl" />
                              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl" />
                         </div>
                         <div className="relative flex flex-col items-center text-center gap-4">
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-600/20 bg-blue-600/5 text-blue-400 text-xs font-medium">
                                   <Sparkles size={12} strokeWidth={2} />
                                   Rwanda&apos;s Premier Wedding Marketplace
                              </div>
                              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                                   Find Your Perfect <span className="text-blue-500">Wedding Vendor</span>
                              </h1>
                              <p className="text-gray-400 text-lg max-w-2xl">
                                   Browse our carefully curated selection of top-rated wedding professionals across Rwanda.
                              </p>
                         </div>
                    </div>

                    {/* Categories */}
                    <div className="w-full px-[5%] lg:px-[8%] pb-20">
                         <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-6">Browse by category</p>

                         {isLoading ? (
                              <div className="grid grid-cols-1 gap-3">
                                   {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-[100px] rounded-2xl bg-gray-900 animate-pulse" />
                                   ))}
                              </div>
                         ) : (
                              <div className="grid grid-cols-1 gap-3">
                                   {categories.map((category) => (
                                        <button
                                             key={category.id}
                                             type="button"
                                             onClick={() => onCategorySelect(category.id)}
                                             className={cn(
                                                  "group w-full flex items-center gap-0 rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden",
                                                  "hover:border-blue-600/40 hover:bg-gray-900 transition-all duration-300 cursor-pointer text-left"
                                             )}
                                        >
                                             {/* Image */}
                                             {category.icon && (
                                                  <div className="relative h-[100px] w-[140px] shrink-0 overflow-hidden">
                                                       <Image
                                                            src={category.icon}
                                                            alt={category.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                       />
                                                       <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-950 group-hover:to-gray-900 transition-colors duration-300" />
                                                  </div>
                                             )}
                                             {/* Info */}
                                             <div className="flex-1 px-5 py-4 flex flex-col gap-1">
                                                  <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-blue-400 transition-colors duration-200">
                                                       {category.name}
                                                  </h3>
                                                  {category.description && (
                                                       <p className="text-gray-500 text-sm line-clamp-1">{category.description}</p>
                                                  )}
                                             </div>
                                             {/* Arrow */}
                                             <div className="px-5 flex items-center justify-center h-full">
                                                  <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-blue-600/0 group-hover:bg-blue-600 border border-gray-800 group-hover:border-blue-600 text-gray-600 group-hover:text-white transition-all duration-300">
                                                       <ArrowRight size={16} strokeWidth={2} />
                                                  </div>
                                             </div>
                                        </button>
                                   ))}
                              </div>
                         )}
                    </div>
               </div>
               
          </div>
     );
}
