'use client';

import { TPost} from '@/common/Entities'
import { PostFeatureCard } from '@/components/cards/PostFeatureCard';
import ImageSlider from '@/components/images/ImageSlider'
import Link from 'next/link'
import React from 'react'
import { TogglePostStatusBtn } from './components';

const PostCard = ({post}:{post: TPost}) => {

     return (
          <div className='w-full flex flex-col items-center justify-start rounded-[5px] bg-white overflow-hidden shadow-sm shadow-gray-400'>
               <div className='w-full flex items-center justify-between px-[5px] pt-[5px]'>
                    <h3 className='text-[0.9rem] text-black font-bold '>{post.title}</h3>
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