'use client';

import { TPost} from '@/common/Entities'
import { PostFeatureCard } from '@/components/cards/PostFeatureCard';
import ImageSlider from '@/components/images/ImageSlider'
import Link from 'next/link'
import React from 'react'
import { TogglePostStatusBtn } from './components';
import { formatPrice } from '@/util/stringFuncs';

const PostCard = ({post}:{post: TPost}) => {
     const price = post.price;
     return (
          <div className='w-full flex flex-col items-center justify-start rounded-xl bg-gray-900 border border-gray-800 overflow-hidden'>
               <div className='w-full flex flex-col items-start justify-between px-2 pt-2'>
                    <h3 className='text-sm text-gray-100 font-bold'>{post.title}</h3>
                    <p className='text-[0.85rem] font-bold text-blue-600'>{price ? `${price.min === 0 && price.max === 0 ? 'Negotiable' : `${price.currency}  ${formatPrice(price.min)} - ${price.max === 0 ? 'Above' : formatPrice(price.max)}`  }` : 'Price not set'}</p>
               </div>
               <ImageSlider images={post.images}  />
               <div className='w-full grid grid-cols-3 gap-[5px] p-[5px]'>
                    {
                         post.features.map(f => f.categoryFeature.onCard ? <PostFeatureCard key={`post-${post.id}-fcard-${f.id}`} feature={f} /> : null)
                    }
               </div>
               <div className='w-full grid grid-cols-2 gap-[10px] p-[5px]'>
                    <Link href={`/dashboard/admin/posts?form=add&id=${post.id}`} prefetch={true} className='w-full text-center text-[0.8rem] py-[5px] bg-orange-600 text-white rounded-[5px]'>Update</Link>
                    <TogglePostStatusBtn status={post.status} id={post.id} />
               </div>
          </div>
     )
}


export default PostCard