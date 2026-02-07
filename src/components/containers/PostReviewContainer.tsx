"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Send, MessageSquare, User, Calendar, AlertCircle } from "lucide-react";
import { createPostReview, fetchPostReviews } from "@/server-actions/post-review.actions";
import { ENotificationType } from "@/common/CommonTypes";
import { showMainNotification } from "@/util/NotificationFuncs";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { useAuthContext } from "../context/AuthContext";

const ReviewSelect = {
     id: true,
     content: true,
     rating: true,
     type: true,
     createdAt: true,
     client: {
          select: {
               id: true,
               name: true,
               user: {
                    select: {
                         image: true
                    }
               }
          }
     }
} satisfies Prisma.PostReviewSelect;

type TReview = Prisma.PostReviewGetPayload<{ select: typeof ReviewSelect }>;

interface PostReviewContainerProps {
     postId: number;
}

export const PostReviewContainer = ({ postId }: PostReviewContainerProps) => {
     const {user} = useAuthContext();
     const [reviews, setReviews] = useState<TReview[]>([]);
     const [loading, setLoading] = useState(true);
     const [submitting, setSubmitting] = useState(false);
     const [page, setPage] = useState(0);
     const [hasMore, setHasMore] = useState(true);
     
     // Form state
     const [rating, setRating] = useState(0);
     const [hoveredRating, setHoveredRating] = useState(0);
     const [content, setContent] = useState("");
     const [reviewType, setReviewType] = useState("review");

     const clientId = user?.client?.id;
     const take = 10;

     // Load reviews
     const loadReviews = useCallback(async (pageNum: number) => {
          try {
               setLoading(true);
               const data = await fetchPostReviews(
                    ReviewSelect,
                    { postId },
                    take,
                    pageNum * take
               );
               
               if (data.length < take) {
                    setHasMore(false);
               }
               
               setReviews(prev => pageNum === 0 ? data : [...prev, ...data]);
          } catch {
               showMainNotification("Failed to load reviews", ENotificationType.FAIL);
          } finally {
               setLoading(false);
          }
     }, [postId]);

     useEffect(() => {
          loadReviews(0);
     }, [loadReviews]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          
          if (!clientId) {
               showMainNotification("Please sign in to leave a review", ENotificationType.FAIL);
               return;
          }

          if (rating === 0) {
               showMainNotification("Please select a rating", ENotificationType.FAIL);
               return;
          }

          if (!content.trim()) {
               showMainNotification("Please write a review", ENotificationType.FAIL);
               return;
          }

          setSubmitting(true);
          try {
               const result = await createPostReview({
                    content: content.trim(),
                    rating,
                    type: reviewType,
                    post: { connect: { id: postId } },
                    client: { connect: { id: clientId } },
                    createdAt: new Date()
               });

               if (result) {
                    showMainNotification("Review submitted successfully!", ENotificationType.PASS);
                    setContent("");
                    setRating(0);
                    setReviewType("review");
                    // Reload reviews
                    setPage(0);
                    loadReviews(0);
               } else {
                    showMainNotification("Failed to submit review", ENotificationType.FAIL);
               }
          } catch {
               showMainNotification("An error occurred", ENotificationType.FAIL);
          } finally {
               setSubmitting(false);
          }
     };

     const loadMore = () => {
          const nextPage = page + 1;
          setPage(nextPage);
          loadReviews(nextPage);
     };

     const formatDate = (date: Date) => {
          const d = new Date(date);
          const now = new Date();
          const diff = now.getTime() - d.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          
          if (days === 0) return "Today";
          if (days === 1) return "Yesterday";
          if (days < 7) return `${days} days ago`;
          if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
          if (days < 365) return `${Math.floor(days / 30)} months ago`;
          return `${Math.floor(days / 365)} years ago`;
     };

     const renderStars = (count: number, interactive: boolean = false, size: "sm" | "md" | "lg" = "md") => {
          const sizes = {
               sm: "w-4 h-4",
               md: "w-5 h-5",
               lg: "w-6 h-6"
          };
          
          return (
               <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                         <Star
                              key={star}
                              className={`${sizes[size]} ${
                                   star <= (interactive ? (hoveredRating || rating) : count)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-600"
                              } ${interactive ? "cursor-pointer transition-all hover:scale-110" : ""}`}
                              onMouseEnter={() => interactive && setHoveredRating(star)}
                              onMouseLeave={() => interactive && setHoveredRating(0)}
                              onClick={() => interactive && setRating(star)}
                         />
                    ))}
               </div>
          );
     };

     return (
          <div className="w-full bg-gray-900 rounded-2xl p-4 md:p-8 border border-gray-800">
               {/* Header */}
               <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-lg">
                         <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                         <h2 className="text-2xl font-bold text-white">Reviews & Ratings</h2>
                         <p className="text-sm text-gray-400">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                    </div>
               </div>

               {/* Review Form */}
               {clientId ? (
                    <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700">
                         <h3 className="text-lg font-semibold text-white mb-4">Share Your Experience</h3>
                         
                         {/* Rating */}
                         <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                   Your Rating *
                              </label>
                              <div className="flex items-center gap-4">
                                   {renderStars(rating, true, "lg")}
                                   {rating > 0 && (
                                        <span className="text-sm text-gray-400">
                                             {rating === 1 && "Poor"}
                                             {rating === 2 && "Fair"}
                                             {rating === 3 && "Good"}
                                             {rating === 4 && "Very Good"}
                                             {rating === 5 && "Excellent"}
                                        </span>
                                   )}
                              </div>
                         </div>

                         {/* Review Type */}
                         <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                   Review Type
                              </label>
                              <div className="flex gap-3">
                                   <button
                                        type="button"
                                        onClick={() => setReviewType("review")}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                             reviewType === "review"
                                                  ? "bg-blue-600 text-white"
                                                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                   >
                                        Review
                                   </button>
                                   <button
                                        type="button"
                                        onClick={() => setReviewType("testimonial")}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                             reviewType === "testimonial"
                                                  ? "bg-blue-600 text-white"
                                                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                   >
                                        Testimonial
                                   </button>
                              </div>
                         </div>

                         {/* Content */}
                         <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                   Your Review *
                              </label>
                              <textarea
                                   value={content}
                                   onChange={(e) => setContent(e.target.value)}
                                   placeholder="Share your experience with this service..."
                                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                   rows={4}
                                   maxLength={500}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                   {content.length}/500 characters
                              </p>
                         </div>

                         {/* Submit Button */}
                         <button
                              type="submit"
                              disabled={submitting || rating === 0 || !content.trim()}
                              className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                              {submitting ? (
                                   <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                   </>
                              ) : (
                                   <>
                                        <Send className="w-5 h-5" />
                                        Submit Review
                                   </>
                              )}
                         </button>
                    </form>
               ) : (
                    <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                         <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                         <p className="text-gray-300 font-medium mb-2">Sign in to leave a review</p>
                         <p className="text-sm text-gray-500">Share your experience with this service</p>
                    </div>
               )}

               {/* Reviews List */}
               <div className="space-y-4">
                    {loading && page === 0 ? (
                         <div className="text-center py-12">
                              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                              <p className="text-gray-400">Loading reviews...</p>
                         </div>
                    ) : reviews.length === 0 ? (
                         <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                              <p className="text-gray-400 font-medium mb-2">No reviews yet</p>
                              <p className="text-sm text-gray-500">Be the first to review this service!</p>
                         </div>
                    ) : (
                         <>
                              {reviews.map((review) => (
                                   <div
                                        key={review.id}
                                        className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700 hover:border-gray-600 transition-all"
                                   >
                                        <div className="flex items-start gap-3 md:gap-4">
                                             {/* Avatar */}
                                             <div className="flex-shrink-0">
                                                  {review.client.user.image ? (
                                                       <Image
                                                            src={review.client.user.image}
                                                            alt={review.client.name}
                                                            width={48}
                                                            height={48}
                                                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-gray-700"
                                                       />
                                                  ) : (
                                                       <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-gray-700">
                                                            <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                                       </div>
                                                  )}
                                             </div>

                                             {/* Content */}
                                             <div className="flex-1 min-w-0">
                                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                                                       <div>
                                                            <h4 className="font-semibold text-white text-sm md:text-base">
                                                                 {review.client.name}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                 {renderStars(review.rating, false, "sm")}
                                                                 <span className="text-xs text-gray-500">
                                                                      {review.rating}/5
                                                                 </span>
                                                            </div>
                                                       </div>
                                                       <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(review.createdAt)}
                                                       </div>
                                                  </div>

                                                  {/* Review Type Badge */}
                                                  {review.type !== "review" && (
                                                       <span className="inline-block px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded mb-2">
                                                            {review.type}
                                                       </span>
                                                  )}

                                                  {/* Review Content */}
                                                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                                       {review.content}
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                              ))}

                              {/* Load More Button */}
                              {hasMore && (
                                   <button
                                        onClick={loadMore}
                                        disabled={loading}
                                        className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                   >
                                        {loading ? (
                                             <div className="flex items-center justify-center gap-2">
                                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                  Loading...
                                             </div>
                                        ) : (
                                             "Load More Reviews"
                                        )}
                                   </button>
                              )}
                         </>
                    )}
               </div>
          </div>
     );
};
