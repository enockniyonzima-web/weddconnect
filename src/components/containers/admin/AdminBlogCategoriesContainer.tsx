"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBlogCategorys, countBlogCategorys } from "@/server-actions/blog/blog-category";
import { BlogCategoryFormBtn } from "@/components/forms/blog/BlogCategoryForm";
import { FolderOpen, FileText, Calendar, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { SBlogCategoryCard, TBlogCategoryCard } from "@/select-types/blog/blog-category";

// ─── Category Card ────────────────────────────────────────────────────────────
const CategoryCard = ({ cat }: { cat: TBlogCategoryCard }) => (
  <div className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-800 bg-gray-900 hover:border-gray-700 transition-colors">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center justify-center h-9 w-9 shrink-0 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400">
        <FolderOpen size={16} strokeWidth={1.5} />
      </div>
      <BlogCategoryFormBtn categoryId={cat.id} showBtnIcon showBtnName btnSize="sm" />
    </div>

    <div className="flex flex-col gap-1 min-w-0">
      <h3 className="text-sm font-semibold text-white truncate">{cat.name}</h3>
      <p className="text-[10px] text-gray-600 truncate font-mono">/{cat.slug}</p>
      {cat.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-0.5">{cat.description}</p>
      )}
    </div>

    <div className="flex items-center gap-3 pt-2 border-t border-gray-800/60">
      <span className="flex items-center gap-1.5 text-xs text-gray-500">
        <FileText size={11} className="text-blue-500" />
        {cat._count.posts} post{cat._count.posts !== 1 ? "s" : ""}
      </span>
      <span className="flex items-center gap-1.5 text-xs text-gray-600 ml-auto">
        <Calendar size={11} />
        {new Date(cat.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
    </div>
  </div>
);

// ─── Container ────────────────────────────────────────────────────────────────
export const AdminBlogCategoriesContainer = () => {
  const [search, setSearch] = useState("");

  const where = search.trim()
    ? { name: { contains: search.trim(), mode: "insensitive" as const } }
    : undefined;

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["blog-categories-admin", search],
    queryFn: () => fetchBlogCategorys(SBlogCategoryCard, where, 100),
  });

  const { data: total = 0 } = useQuery({
    queryKey: ["blog-categories-count"],
    queryFn: () => countBlogCategorys(),
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400">
            <FolderOpen size={16} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Blog Categories</h2>
            <p className="text-xs text-gray-500">{total} categor{total !== 1 ? "ies" : "y"} total</p>
          </div>
        </div>
        <BlogCategoryFormBtn showBtnIcon showBtnName btnSize="sm" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1 p-3 rounded-xl border border-gray-800 bg-gray-900">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total</span>
          <span className="text-xl font-bold text-white">{total}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-xl border border-gray-800 bg-gray-900">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">With Posts</span>
          <span className="text-xl font-bold text-white">{categories.filter(c => c._count.posts > 0).length}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-xl border border-gray-800 bg-gray-900">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Empty</span>
          <span className="text-xl font-bold text-white">{categories.filter(c => c._count.posts === 0).length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="w-full bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-600 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-600/50"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={22} className="animate-spin text-blue-500" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-600">
          <FolderOpen size={32} strokeWidth={1} />
          <p className="text-sm">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
        </div>
      )}
    </div>
  );
};
