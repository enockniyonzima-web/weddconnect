"use client";

import { TPost } from '@/common/Entities';
import { PostFeatureCard } from '@/components/cards/PostFeatureCard';
import ImageSlider from '@/components/images/ImageSlider';
import { formatPrice } from '@/util/stringFuncs';
import { PostCardVendorContacts } from './VendorContactCard';
import { MapPin, Heart, Star } from 'lucide-react';
import Link from 'next/link';

const PostCard = ({ post }: { post: TPost }) => {
     const price = post.price;
     const priceLabel = price
          ? price.min === 0 && price.max === 0
               ? 'Negotiable'
               : `${price.currency} ${formatPrice(price.min)}${price.max === 0 ? '+' : ` – ${formatPrice(price.max)}`}`
          : 'Negotiable';

     const cardFeatures = post.features.filter(f => f.categoryFeature.onCard);

     return (
          <div className='group w-full flex flex-col rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden hover:border-blue-600/40 transition-all duration-300'>
               {/* Image slider */}
               <div className='relative w-full overflow-hidden aspect-[4/3]'>
                    <ImageSlider link={`/posts/${post.id}`} images={post.images} />
                    {post.vendor.contacts.length > 0 && (
                         <PostCardVendorContacts contacts={post.vendor.contacts} />
                    )}
                    {/* Location badge */}
                    <div className='absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 max-w-[60%]'>
                         <MapPin size={11} strokeWidth={2} className='text-blue-400 shrink-0' />
                         <p className='text-xs text-white line-clamp-1'>{post.location}</p>
                    </div>
                    {/* Stats badge */}
                    <div className='absolute top-3 right-3 flex items-center gap-2'>
                         {post._count.likes > 0 && (
                              <div className='flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-xs text-gray-300'>
                                   <Heart size={10} strokeWidth={2} className='text-pink-400' />
                                   {post._count.likes}
                              </div>
                         )}
                         {post._count.reviews > 0 && (
                              <div className='flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-xs text-gray-300'>
                                   <Star size={10} strokeWidth={2} className='text-yellow-400' />
                                   {post._count.reviews}
                              </div>
                         )}
                    </div>
               </div>

               {/* Body */}
               <div className='flex flex-col gap-3 p-4'>
                    <div className='flex flex-col gap-1'>
                         <Link href={`/posts/${post.id}`} className='text-white font-semibold text-base leading-snug hover:text-blue-400 transition-colors line-clamp-2'>
                              {post.title}
                         </Link>
                         <p className='text-blue-500 font-bold text-sm'>{priceLabel}</p>
                    </div>

                    {/* Features */}
                    {cardFeatures.length > 0 && (
                         <div className='grid grid-cols-3 gap-1.5 pt-1 border-t border-gray-800/60'>
                              {cardFeatures.slice(0, 3).map(f => (
                                   <PostFeatureCard key={`post-${post.id}-fcard-${f.id}`} feature={f} />
                              ))}
                         </div>
                    )}
               </div>
          </div>
     );
};

export default PostCard;
