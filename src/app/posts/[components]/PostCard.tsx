"use client";

import { TPost} from '@/common/Entities';
import { PostFeatureCard } from '@/components/cards/PostFeatureCard';
import ImageSlider from '@/components/images/ImageSlider';
import { formatPrice } from '@/util/stringFuncs';
import React from 'react'
import { PostCardVendorContacts } from './VendorContactCard';
import { FaLocationDot } from 'react-icons/fa6';

const PostCard = ({post}:{post: TPost}) => {
  return (
      <div className='w-full flex flex-col items-center justify-start bg-white shadow-sm shadow-gray-600 rounded-[10px] overflow-hidden'>
        <div className='w-full p-[5px] flex flex-col items-start justify-between' >
          <h3 className='text-[1.2rem] font-bold text-black'>{post.title.toUpperCase()}</h3>
          <p className='text-blue-600 font-extrabold text-[1.1rem]'>{post.price ? `RWF ${formatPrice(post.price.min)} - ${formatPrice(post.price.max)} ` : 'Negotiable'}</p>
        </div>
        <div className='w-full mx-auto overflow-hidden rounded-[0px]'>
          <div className=' w-full relative'>
            <ImageSlider link={`/posts/${post.id}`} images={post.images} />
            {post.vendor.contacts.length > 0 ? <PostCardVendorContacts contacts={post.vendor.contacts} /> :null}
            <div className='w-auto flex items-center justify-end gap-[5px] bg-black/80 p-[5px] rounded-[5px] absolute bottom-[2.5px] right-[2.5px]'>
              <i className='text-blue-200 text-[16px]'><FaLocationDot /></i>
              <span className='text-[0.8rem] text-white'>{post.location}</span>
            </div>
          </div>
        </div>
        <div className='w-full grid grid-cols-3 gap-[10px] p-[5px]'>
            {
              post.features.map(f => f.categoryFeature.onCard ? <PostFeatureCard key={`post-${post.id}-fcard-${f.id}`} feature={f} /> : null)
            }
        </div>
      </div>
  )
}



export default PostCard