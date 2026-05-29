import { fetchBlogPosts } from "@/server-actions/blog/blog-post";
import { SPubBlogPostCard } from "@/select-types/blog/blog-post";
import { EBlogPostStatus } from "@prisma/client";
import { PubBlogPostCard } from "@/components/cards/PubBlogCard";
import Link from "next/link";
import Image from "@/components/ui/Image";
import { ArrowRight, Calendar, Clock, Eye, Tag } from "lucide-react";

export default async function HomeBlogSection() {
  const posts = await fetchBlogPosts(SPubBlogPostCard, { status: EBlogPostStatus.PUBLISHED }, 7, 0, { publishedAt: "desc" });

  if (!posts.length) return null;

  const [featured, ...rest] = posts;

  return (
    <section className="w-full bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">From the blog</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Wedding <span className="text-blue-500">Inspiration</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-md">
              Tips, trends, and stories to help you plan the perfect wedding day.
            </p>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
          >
            View all posts
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group relative w-full rounded-3xl overflow-hidden border border-gray-800 hover:border-blue-600/40 transition-all duration-300 bg-gray-900"
        >
          <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] overflow-hidden">
            {featured.featuredImageUrl ? (
              <Image
                src={featured.featuredImageUrl}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-900/30 to-gray-950 flex items-center justify-center">
                <Tag size={48} strokeWidth={0.8} className="text-gray-700" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          {/* Content over image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col gap-3">
            {featured.category && (
              <span className="w-fit text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-blue-600 text-white">
                {featured.category.name}
              </span>
            )}
            <h3 className="text-xl sm:text-3xl font-bold text-white leading-tight max-w-2xl group-hover:text-blue-200 transition-colors">
              {featured.title}
            </h3>
            <p className="text-sm text-gray-300 line-clamp-2 max-w-xl">{featured.summary}</p>
            <div className="flex items-center gap-4 flex-wrap">
              {featured.readingTime && (
                <span className="flex items-center gap-1.5 text-xs text-gray-400"><Clock size={12} />{featured.readingTime}m read</span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><Eye size={12} />{featured.viewsCount} views</span>
              {featured.publishedAt && (
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar size={12} />
                  {new Date(featured.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              )}
              <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300">
                Read more <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>

        {/* Grid of remaining */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post) => (
              <PubBlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/blog"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 text-white text-sm font-semibold transition-colors"
          >
            Explore all articles <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}