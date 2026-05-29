import { fetchBlogPostBySlug } from "@/server-actions/blog/blog-post";
import { SPubBlogPostFull } from "@/select-types/blog/blog-post";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RichTextView from "@/components/ui/rich-text-viewer";
import { BlogCommentsSection } from "@/components/sections/BlogCommentsSection";
import { BlogImageGallery } from "@/components/sections/BlogImageGallery";
import { Calendar, Clock, Eye, MessageCircle, Tag, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import ClientPage from "@/components/layout/ClientPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug, { title: true, summary: true });
  if (!post) return {};
  return { title: `${post.title} | WeddConnect Blog`, description: post.summary };
}

export default async function PubBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug, SPubBlogPostFull);
  if (!post) notFound();

  const hasImages = post.images && post.images.length > 0;
  const hasVideos = post.videos && post.videos.length > 0;

  return (
     <ClientPage>
          <main className="min-h-screen bg-black py-24">
      {/* Hero */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] min-h-[340px] max-h-[600px] overflow-hidden">
        {post.featuredImageUrl ? (
          <Image src={post.featuredImageUrl} alt={post.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-8 pb-10 max-w-5xl mx-auto w-full left-0 right-0">
          <Link href="/blog" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-4 transition-colors w-fit">
            <ArrowLeft size={14} /> Back to blog
          </Link>
          {post.category && (
            <Link href={`/blog?category=${post.category.slug}`} className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 w-fit">
              {post.category.name}
            </Link>
          )}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
            {post.title}
          </h1>
          {post.summary && (
            <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl line-clamp-2">{post.summary}</p>
          )}
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-400">
            {post.author?.name && <span className="text-white font-medium">{post.author.name}</span>}
            {post.publishedAt && (
              <span className="flex items-center gap-1"><Calendar size={12} />{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
            )}
            {post.readingTime && (
              <span className="flex items-center gap-1"><Clock size={12} />{post.readingTime} min read</span>
            )}
            {post.viewsCount > 0 && (
              <span className="flex items-center gap-1"><Eye size={12} />{post.viewsCount.toLocaleString()} views</span>
            )}
            {post.commentsCount > 0 && (
              <span className="flex items-center gap-1"><MessageCircle size={12} />{post.commentsCount} comments</span>
            )}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
        {/* Main */}
        <article className="flex-1 min-w-0 flex flex-col gap-10">
          {/* Rich text */}
          <div>
            <RichTextView content={post.content} showBorder={false} />
          </div>

          {/* Image gallery */}
          {hasImages && (
            <section>
              <h2 className="text-base font-bold text-white mb-4">Gallery</h2>
              <BlogImageGallery images={post.images as string[]} />
            </section>
          )}

          {/* Videos */}
          {hasVideos && (
            <section className="flex flex-col gap-4">
              <h2 className="text-base font-bold text-white">Videos</h2>
              {(post.videos as string[]).map((url, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-950 aspect-video">
                  <video src={url} controls className="w-full h-full object-contain" />
                </div>
              ))}
            </section>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog?tag=${tag.slug}`}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:border-blue-600/50 hover:text-blue-400 transition-colors"
                >
                  <Tag size={10} />#{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-800" />

          {/* Comments */}
          {post.allowComments && <BlogCommentsSection postId={post.id} />}
        </article>

        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0 flex flex-col gap-6">
          {/* Author card */}
          {post.author && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Author</p>
              <p className="text-sm font-semibold text-white">{post.author.name}</p>
            </div>
          )}
          {/* Article stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3">
            <p className="text-xs text-gray-600 uppercase tracking-wider">Article Info</p>
            {post.publishedAt && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Published</span>
                <span className="text-gray-300">{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
              </div>
            )}
            {post.readingTime && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Read time</span>
                <span className="text-gray-300">{post.readingTime} min</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Views</span>
              <span className="text-gray-300">{post.viewsCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Comments</span>
              <span className="text-gray-300">{post.commentsCount}</span>
            </div>
          </div>
          {/* Back link */}
          <Link href="/blog" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={14} /> All articles
          </Link>
        </aside>
      </div>
    </main>
     </ClientPage>
    
  );
}