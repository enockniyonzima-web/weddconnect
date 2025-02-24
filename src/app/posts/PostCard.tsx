"use client";

import { TPost } from '@/common/Entities';
import React from 'react'

const PostCard = ({post}:{post: TPost}) => {
  return (
     <div className='flex flex-col items-center justify-start'>
          <h3>{post.title}</h3>
     </div>
  )
}

export default PostCard