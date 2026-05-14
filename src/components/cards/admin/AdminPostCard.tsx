"use client";

import { TAdminPostCard } from "@/select-types/post";
import { PostFeatureCard } from "../PostFeatureCard";
import ImageSlider from "@/components/images/ImageSlider";
import { formatPrice } from "@/util/stringFuncs";
import { Heart, MapPin,  Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { TogglePostStatusBtn } from "@/components/buttons/admin/TogglePostStatusBtn";
import { PostFormBtn } from "@/components/forms/PostForm";

const STATUS_STYLE: Record<string, string> = {
     published:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
     pending:     "bg-gray-500/60 text-amber-400 border-amber-500/20",
     unpublished: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export const AdminPostCard = ({ post }: { post: TAdminPostCard }) => {
     const price = post.price;
     const priceLabel = price
          ? price.min === 0 && price.max === 0
               ? "Negotiable"
               : `${price.currency} ${formatPrice(price.min)}${price.max === 0 ? "+" : ` – ${formatPrice(price.max)}`}`
          : "Price not set";

     const status = post.status ?? "pending";
     const visibleFeatures = post.features.filter((f) => f.categoryFeature.onCard);

     return (
          <div className="group w-full flex flex-col rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors duration-200">
               {/* Image slider */}
               <div className="relative w-full">
                    <ImageSlider images={post.images} />
                    {/* Status badge */}
                    <span className={cn(
                         "absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border",
                         STATUS_STYLE[status] ?? STATUS_STYLE.pending
                    )}>
                         {status}
                    </span>
               </div>

               {/* Body */}
               <div className="flex flex-col gap-2 p-3">
                    {/* Title & price */}
                    <div className="flex flex-col gap-0.5">
                         <h3 className="text-sm font-semibold text-white leading-snug line-clamp-1">{post.title}</h3>
                         <p className="text-xs font-bold text-blue-400">{priceLabel}</p>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 text-[11px] text-gray-500">
                         {post.location && (
                              <span className="flex items-center gap-1"><MapPin size={10} /> {post.location}</span>
                         )}
                         <span className="flex items-center gap-1 ml-auto">
                              <Heart size={10} /> {post._count.likes}
                         </span>
                         <span className="flex items-center gap-1">
                              <Star size={10} /> {post._count.reviews}
                         </span>
                    </div>

                    {/* Features */}
                    {visibleFeatures.length > 0 && (
                         <div className="grid grid-cols-3 gap-1">
                              {visibleFeatures.map((f) => (
                                   <PostFeatureCard key={`post-${post.id}-fcard-${f.id}`} feature={f} />
                              ))}
                         </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                         <PostFormBtn showBtnIcon showBtnName postId={post.id} />
                         <TogglePostStatusBtn status={status} id={post.id} />
                    </div>
               </div>
          </div>
     );
};
