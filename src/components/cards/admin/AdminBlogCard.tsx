"use client";

import { EBlogPostStatus } from "@prisma/client";
import { Calendar, Eye, MessageSquare, Clock, Tag } from "lucide-react";
import Link from "next/link";
import Image from "@/components/ui/Image";
import { TBlogPostCard } from "@/select-types/blog/blog-post";

const statusStyle: Record<EBlogPostStatus, string> = {
  PUBLISHED: "bg-green-500/15 text-green-400 border-green-500/30",
  DRAFT: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  ARCHIVED: "bg-gray-700/30 text-gray-500 border-gray-700",
};

export const AdminBlogCard = ({ post }: { post: TBlogPostCard }) => {
  return (
    <Link
      href={`/dashboard/admin/blog/blog-post/${post.id}`}
      className="group flex flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-600/40 transition-all duration-200"
    >
      {/* Featured image */}
      <div className="relative w-full aspect-video bg-gray-800 overflow-hidden">
        {post.featuredImageUrl ? (
          <Image
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">
            <Tag size={28} strokeWidth={1.5} />
          </div>
        )}
        {/* Status badge */}
        <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[post.status]}`}>
          {post.status}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {post.category && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
            {post.category.name}
          </span>
        )}
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.summary}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t.id} className="text-[10px] px-2 py-0.5 rounded-full border border-gray-800 bg-gray-900 text-gray-500">
                {t.name}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-800/60">
          <span className="flex items-center gap-1 text-[10px] text-gray-600">
            <Eye size={11} />{post.viewsCount}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-600">
            <MessageSquare size={11} />{post.commentsCount}
          </span>
          {post.readingTime && (
            <span className="flex items-center gap-1 text-[10px] text-gray-600">
              <Clock size={11} />{post.readingTime}m
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-gray-600 ml-auto">
            <Calendar size={11} />
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>
    </Link>
  );
};
