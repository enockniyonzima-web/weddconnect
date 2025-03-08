"use client";

import { TPost } from '@/common/Entities';
import ImageSlider from '@/components/images/ImageSlider';
import { formatPrice } from '@/util/stringFuncs';
import React from 'react'

const PostCard = ({post}:{post: TPost}) => {
  return (
      <div className='w-full flex flex-col items-center justify-start bg-white shadow-sm shadow-gray-300 rounded-[5px] overflow-hidden'>
        <div className='w-full p-[5px] flex items-center justify-between' >
          <h3 className='text-[1.2rem] font-bold text-black'>{post.title}</h3>
          <p className='text-blue-600 font-bold text-[0.9rem]'>{post.price ? `RWF ${formatPrice(post.price.min)} - ${formatPrice(post.price.max)} ` : 'Negotiable'}</p>
        </div>
        <div className='w-[98%] mx-auto overflow-hidden rounded-[5px]'>
          <ImageSlider images={post.images} />
        </div>
      </div>
  )
}

export default PostCard