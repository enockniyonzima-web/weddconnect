"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPosts, countBlogPosts } from "@/server-actions/blog/blog-post";
import { fetchBlogCategorys } from "@/server-actions/blog/blog-category";
import { SPubBlogPostCard } from "@/select-types/blog/blog-post";
import { SBlogCategoryOption } from "@/select-types/blog/blog-category";
import { EBlogPostStatus } from "@prisma/client";
import { PubBlogPostCard } from "@/components/cards/PubBlogCard";
import { Search, Filter, Loader2, BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react";

const PER_PAGE = 9;
const PUBLISHED = EBlogPostStatus.PUBLISHED;

export const PubBlogPostsContainer = () => {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data: categories = [] } = useQuery({
    queryKey: ["pub-categories"],
    queryFn: () => fetchBlogCategorys(SBlogCategoryOption, undefined, 50),
  });

  const where = {
    status: PUBLISHED,
    ...(categoryId ? { categoryId } : {}),
    ...(search.trim() ? { title: { contains: search.trim(), mode: "insensitive" as const } } : {}),
  };

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["pub-blog-posts", search, categoryId, page],
    queryFn: () => fetchBlogPosts(SPubBlogPostCard, where, PER_PAGE, (page - 1) * PER_PAGE, { publishedAt: "desc" }),
  });

  const { data: total = 0 } = useQuery({
    queryKey: ["pub-blog-count", search, categoryId],
    queryFn: () => countBlogPosts(where),
  });

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const reset = () => { setSearch(""); setCategoryId(""); setPage(1); };

  const hasFilters = !!search || !!categoryId;

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Hero header */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950 border border-gray-800 px-6 py-12 sm:px-12 sm:py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08),_transparent_70%)]" />
        <div className="relative flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">WeddConnect Blog</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
            Wedding <span className="text-blue-500">Inspiration</span> & Tips
          </h1>
          <p className="text-sm text-gray-400 max-w-lg">
            Expert advice, real wedding stories, and planning tips to make your dream day a reality.
          </p>
          <span className="text-xs text-gray-600 mt-1">{total} article{total !== 1 ? "s" : ""} published</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search articles…"
            className="w-full bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-600 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-600/50 transition-colors"
          />
        </div>
        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="shrink-0 flex items-center gap-1 text-xs text-gray-600"><Filter size={12} />Filter:</span>
          <button
            onClick={() => { setCategoryId(""); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!categoryId ? "bg-blue-600 border-blue-600 text-white" : "border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"}`}
          >All</button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCategoryId(c.id); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${categoryId === c.id ? "bg-blue-600 border-blue-600 text-white" : "border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"}`}
            >{c.name}</button>
          ))}
          {hasFilters && (
            <button onClick={reset} className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-400 transition-colors">
              <X size={12} />Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-blue-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
          <BookOpen size={36} strokeWidth={1} />
          <p className="text-sm">No articles found</p>
          {hasFilters && <button onClick={reset} className="text-xs text-blue-400 hover:text-blue-300">Clear filters</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => <PubBlogPostCard key={post.id} post={post} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border border-gray-800 text-gray-400 disabled:opacity-40 hover:border-gray-600 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-xs text-gray-500 px-3">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border border-gray-800 text-gray-400 disabled:opacity-40 hover:border-gray-600 hover:text-white transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};