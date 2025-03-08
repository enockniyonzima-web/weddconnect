import { TPost } from '@/common/Entities'
import React from 'react'
import PostCard from './PostCard'

const PostsContainer = ({posts}:{posts:TPost[]}) => {
     return (
          <>
          {
               posts.length > 0 ? 
               <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-[10px]'>
                    {posts.map((post:TPost, index:number) => <PostCard post={post} key={`posts-page-post-${index}`} />)}
               </div>
               :
               <div className='w-full flex items-center justify-center py-[20px]'>
                    <p className='text-[0.9rem] text-gray-600'>No Vendors found</p>
               </div>
          }
          </>
     
     )
}

export default PostsContainer