"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBlogTags, countBlogTags } from "@/server-actions/blog/blog-tag";
import { BlogTagFormBtn } from "@/components/forms/blog/BlogTagForm";
import { Hash, FileText, Calendar, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { SBlogTagCard, TBlogTagCard } from "@/select-types/blog/blog-tag";

// ─── Tag Card ─────────────────────────────────────────────────────────────────
const TagCard = ({ tag }: { tag: TBlogTagCard }) => (
  <div className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-800 bg-gray-900 hover:border-gray-700 transition-colors">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center justify-center h-9 w-9 shrink-0 rounded-xl bg-purple-600/10 border border-purple-600/20 text-purple-400">
        <Hash size={16} strokeWidth={1.5} />
      </div>
      <BlogTagFormBtn TagId={tag.id} showBtnIcon showBtnName btnSize="sm" />
    </div>

    <div className="flex flex-col gap-1 min-w-0">
      <h3 className="text-sm font-semibold text-white truncate">{tag.name}</h3>
      <p className="text-[10px] text-gray-600 truncate font-mono">#{tag.slug}</p>
    </div>

    <div className="flex items-center gap-3 pt-2 border-t border-gray-800/60">
      <span className="flex items-center gap-1.5 text-xs text-gray-500">
        <FileText size={11} className="text-purple-500" />
        {tag._count.posts} post{tag._count.posts !== 1 ? "s" : ""}
      </span>
      <span className="flex items-center gap-1.5 text-xs text-gray-600 ml-auto">
        <Calendar size={11} />
        {new Date(tag.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
    </div>
  </div>
);

// ─── Container ────────────────────────────────────────────────────────────────
export const AdminBlogTagsContainer = () => {
  const [search, setSearch] = useState("");

  const where = search.trim()
    ? { name: { contains: search.trim(), mode: "insensitive" as const } }
    : undefined;

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["blog-tags-admin", search],
    queryFn: () => fetchBlogTags(SBlogTagCard, where, 200),
  });

  const { data: total = 0 } = useQuery({
    queryKey: ["blog-tags-count"],
    queryFn: () => countBlogTags(),
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-purple-600/10 border border-purple-600/20 text-purple-400">
            <Hash size={16} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Blog Tags</h2>
            <p className="text-xs text-gray-500">{total} tag{total !== 1 ? "s" : ""} total</p>
          </div>
        </div>
        <BlogTagFormBtn showBtnIcon showBtnName btnSize="sm" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1 p-3 rounded-xl border border-gray-800 bg-gray-900">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total</span>
          <span className="text-xl font-bold text-white">{total}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-xl border border-gray-800 bg-gray-900">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Used</span>
          <span className="text-xl font-bold text-white">{tags.filter(t => t._count.posts > 0).length}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-xl border border-gray-800 bg-gray-900">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Unused</span>
          <span className="text-xl font-bold text-white">{tags.filter(t => t._count.posts === 0).length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tags…"
          className="w-full bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-600 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-600/50"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={22} className="animate-spin text-purple-500" />
        </div>
      ) : tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-600">
          <Hash size={32} strokeWidth={1} />
          <p className="text-sm">No tags found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tags.map((tag) => <TagCard key={tag.id} tag={tag} />)}
        </div>
      )}
    </div>
  );
};
