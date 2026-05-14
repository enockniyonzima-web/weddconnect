"use client";

import queryClient from "@/lib/queryClient";
import { updatePost } from "@/server-actions/post.actions";
import { useState } from "react";
import { toast } from "sonner";

export const TogglePostStatusBtn = ({status, id}:{status:string, id:number}) => {
     const [updating, setUpdating] = useState(false);

     const toggleStatus= async () => {
          toast.promise(
               (async() => {
                    try {
                         setUpdating(true);
                         const postUpdate = await updatePost(id, {
                              status: status === 'pending' || status === 'unpublished' ? 'published' : 'unpublished'
                         });
                         if(!postUpdate) throw new Error('Failed to update post status');
                         queryClient.invalidateQueries();
                    } catch (error) {
                         throw error;
                    }finally{
                         setUpdating(false);
                    }
               })(),
               {
                    loading: status === 'pending' || status === 'unpublished' ? 'Publishing post...' : 'Unpublishing post...',
                    success: status === 'pending' || status === 'unpublished' ? 'Post published successfully!' : 'Post unpublished successfully!',
                    error: error => error.message || (status === 'pending' || status === 'unpublished' ? 'Failed to publish post.' : 'Failed to unpublish post.')
               }
          )
          
     }
     return (
          <>
               {
                    status === 'pending' || status === 'unpublished' ? <button onClick={toggleStatus} type='button' className='w-full rounded-[5px] py-[5px] text-center text-[0.8rem] flex items-center gap-[5[x] justify-center bg-green-600 text-white hover:bg-green-800 disabled:bg-gray-800' disabled={updating}>{updating? 'Publishing...' :"Publish"}</button>:
                    <button type='button' onClick={toggleStatus} className='w-full rounded-[5px] py-[5px] text-center flex items-center gap-[5px] bg-red-600 text-white hover:bg-red-800 justify-center disabled:bg-gray-800 text-[0.8rem]' disabled={updating}>{updating? "Unpublishing..." :'UnPublish'}</button>
               }
          </>
     )
}