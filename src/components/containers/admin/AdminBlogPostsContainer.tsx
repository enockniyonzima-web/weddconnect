"use client";

import { countBlogPosts, fetchBlogPosts } from "@/server-actions/blog/blog-post";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AdminBlogCard } from "@/components/cards/admin/AdminBlogCard";
import { EBlogPostStatus } from "@prisma/client";
import { FileText, Loader2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SBlogPostCard } from "@/select-types/blog/blog-post";

const STATUS_FILTERS: { label: string; value: EBlogPostStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Archived", value: "ARCHIVED" },
];

const PER_PAGE = 12;

export const AdminBlogPostsContainer = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EBlogPostStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const where = {
    ...(status !== "ALL" ? { status } : {}),
    ...(search.trim()
      ? { title: { contains: search.trim(), mode: "insensitive" as const } }
      : {}),
  };

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", status, search, page],
    queryFn: () =>
      fetchBlogPosts(SBlogPostCard, where, PER_PAGE, (page - 1) * PER_PAGE, {
        createdAt: "desc",
      }),
  });

  const { data: total = 0 } = useQuery({
    queryKey: ["blog-posts-count", status, search],
    queryFn: () => countBlogPosts(where),
  });

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400">
            <FileText size={16} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Blog Posts</h2>
            <p className="text-xs text-gray-500">{total} post{total !== 1 ? "s" : ""} total</p>
          </div>
        </div>
        <Link
          href="/dashboard/admin/blog/form"
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          <Plus size={14} strokeWidth={2.5} />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by title…"
            className="w-full bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-600 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-600/50"
          />
        </div>
        {/* Status pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatus(f.value); setPage(1); }}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border font-medium transition-colors",
                status === f.value
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={22} className="animate-spin text-blue-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
          <FileText size={32} strokeWidth={1} />
          <p className="text-sm">No posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <AdminBlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-800 text-gray-400 disabled:opacity-40 hover:border-gray-600 transition-colors"
          >
            Prev
          </button>
          <span className="text-xs text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-800 text-gray-400 disabled:opacity-40 hover:border-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
