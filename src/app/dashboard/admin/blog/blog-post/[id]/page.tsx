import { fetchBlogPostById } from "@/server-actions/blog/blog-post";
import RichTextView from "@/components/ui/rich-text-viewer";
import Link from "next/link";
import Image from "@/components/ui/Image";
import { ArrowLeft, Calendar, Clock, Eye, MessageSquare, Pencil, Tag } from "lucide-react";
import { EBlogPostStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { SBlogPostEdit } from "@/select-types/blog/blog-post";

const statusStyle: Record<EBlogPostStatus, string> = {
     PUBLISHED: "bg-green-500/15 text-green-400 border-green-500/30",
     DRAFT: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
     ARCHIVED: "bg-gray-700/30 text-gray-500 border-gray-700",
};

export default async function AdminBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;
     const post = await fetchBlogPostById(id, SBlogPostEdit);

     if (!post) return notFound();

     return (
          <div className="w-full flex flex-col gap-6 max-w-5xl mx-auto">
               {/* Top bar */}
               <div className="flex items-center justify-between gap-4">
                    <Link href="/dashboard/admin/blog" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                         <ArrowLeft size={15} /> Back
                    </Link>
                    <Link
                         href={`/dashboard/admin/blog/form?id=${post.id}`}
                         className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                         <Pencil size={13} strokeWidth={2.5} /> Edit Post
                    </Link>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                    {/* Main */}
                    <div className="flex flex-col gap-5">
                         {/* Featured image */}
                         {post.featuredImageUrl && (
                              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900">
                                   <Image src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover" />
                              </div>
                         )}

                         {/* Title + meta */}
                         <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                   {post.category && (
                                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                                             {post.category.name}
                                        </span>
                                   )}
                                   <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[post.status]}`}>
                                        {post.status}
                                   </span>
                              </div>
                              <h1 className="text-xl font-bold text-white leading-snug">{post.title}</h1>
                              {post.summary && <p className="text-sm text-gray-400 leading-relaxed">{post.summary}</p>}
                         </div>

                         {/* Content */}
                         {post.content ? (
                              <RichTextView content={post.content} showBorder={false} />
                         ) : (
                              <p className="text-sm text-gray-600 italic">No content yet.</p>
                         )}

                         {/* Extra images */}
                         {post.images && (post.images as string[]).length > 0 && (
                              <div className="flex flex-col gap-3">
                                   <h3 className="text-sm font-semibold text-gray-400">Post Images</h3>
                                   <div className="grid grid-cols-3 gap-2">
                                        {(post.images as string[]).map((url, i) => (
                                             <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-900">
                                                  <Image src={url} alt={`image-${i}`} className="w-full h-full object-cover" />
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         )}
                    </div>

                    {/* Sidebar */}
                    <aside className="flex flex-col gap-4">
                         {/* Stats */}
                         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-3">
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stats</h3>
                              <div className="flex flex-col gap-2">
                                   <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-gray-400"><Eye size={13} />Views</span>
                                        <span className="text-white font-medium">{post.viewsCount ?? 0}</span>
                                   </div>
                                   <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-gray-400"><MessageSquare size={13} />Comments</span>
                                        <span className="text-white font-medium">{post.commentsCount ?? 0}</span>
                                   </div>
                                   {post.readingTime && (
                                        <div className="flex items-center justify-between text-sm">
                                             <span className="flex items-center gap-2 text-gray-400"><Clock size={13} />Read time</span>
                                             <span className="text-white font-medium">{post.readingTime} min</span>
                                        </div>
                                   )}
                              </div>
                         </div>

                         {/* Details */}
                         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-3">
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</h3>
                              <div className="flex flex-col gap-2 text-sm">
                                   <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Author</span>
                                        <span className="text-gray-300">{post.author?.name ?? "—"}</span>
                                   </div>
                                   <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-gray-500"><Calendar size={12} />Created</span>
                                        <span className="text-gray-300">
                                             {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </span>
                                   </div>
                                   {post.publishedAt && (
                                        <div className="flex items-center justify-between">
                                             <span className="text-gray-500">Published</span>
                                             <span className="text-gray-300">
                                                  {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                             </span>
                                        </div>
                                   )}
                                   <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Comments</span>
                                        <span className="text-gray-300">{post.allowComments ? "Enabled" : "Disabled"}</span>
                                   </div>
                                   <div className="flex items-start justify-between gap-2">
                                        <span className="text-gray-500 shrink-0">Slug</span>
                                        <span className="text-gray-400 text-xs break-all text-right">{post.slug}</span>
                                   </div>
                              </div>
                         </div>

                         {/* Tags */}
                         {post.tags.length > 0 && (
                              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-3">
                                   <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Tag size={12} />Tags</h3>
                                   <div className="flex flex-wrap gap-1.5">
                                        {post.tags.map((t) => (
                                             <span key={t.id} className="text-[10px] px-2 py-1 rounded-full border border-gray-800 bg-black text-gray-400">
                                                  {t.name}
                                             </span>
                                        ))}
                                   </div>
                              </div>
                         )}
                    </aside>
               </div>
          </div>
     );
}