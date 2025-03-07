import { TPost } from '@/common/Entities'
import ImageSlider from '@/components/images/ImageSlider'
import Link from 'next/link'
import React from 'react'

const PostCard = ({post}:{post: TPost}) => {

     return (
          <div className='w-full flex flex-col items-center justify-start gap-[10px] rounded-[5px] bg-white overflow-hidden shadow-sm shadow-gray-400'>
               <div className='w-full flex items-center justify-between px-[5px] pt-[5px]'>
                    <h3 className='text-[0.9rem] text-black font-bold '>{post.title}</h3>
               </div>
               <ImageSlider images={post.images}  />
               <div className='w-full grid grid-cols-2 gap-[10px] p-[5px]'>
                    <Link href={`/dashboard/admin/posts?form=add&id=${post.id}`} prefetch={true} className='w-full text-center text-[0.9rem] py-[10px] bg-orange-600 text-white rounded-[5px]'>Update</Link>
                    {
                         post.status === 'pending' || post.status === 'unpublished' ? <button type='button' className='w-full rounded-[5px] py-[10px] text-center flex items-center gap-[5[x] justify-center bg-green-600 text-white hover:bg-green-800'>Publish</button>:
                         <button type='button' className='w-full rounded-[5px] py-[10px] text-center flex items-center gap-[5[x] bg-green-600 text-white hover:bg-green-800 justify-center'>UnPublish</button>
                    }
               </div>
          </div>
     )
}

export default PostCard