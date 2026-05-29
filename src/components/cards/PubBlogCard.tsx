"use client";

import { TPubBlogPostCard } from "@/select-types/blog/blog-post";
import { Calendar, Eye, MessageSquare, Clock, Tag } from "lucide-react";
import Link from "next/link";
import Image from "@/components/ui/Image";

export const PubBlogPostCard = ({ post }: { post: TPubBlogPostCard }) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-600/40 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/9] bg-gray-800 overflow-hidden">
        {post.featuredImageUrl ? (
          <Image
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag size={28} strokeWidth={1} className="text-gray-700" />
          </div>
        )}
        {post.category && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-blue-400 border border-blue-500/30">
            {post.category.name}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-4 flex-1">
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.summary}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t.slug} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 border border-gray-800">
                #{t.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-800/60">
          {post.readingTime && (
            <span className="flex items-center gap-1 text-[10px] text-gray-600">
              <Clock size={11} />{post.readingTime}m read
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-gray-600">
            <Eye size={11} />{post.viewsCount}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-600">
            <MessageSquare size={11} />{post.commentsCount}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-600 ml-auto">
            <Calendar size={11} />
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
          </span>
        </div>
      </div>
    </Link>
  );
};
