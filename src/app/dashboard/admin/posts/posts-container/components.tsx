/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ENotificationType } from "@/common/CommonTypes";
import { updatePost } from "@/server-actions/post.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { useState } from "react";

export const TogglePostStatusBtn = ({status, id}:{status:string, id:number}) => {
     const [updating, setUpdating] = useState(false);

     const toggleStatus= async () => {
          try {
               setUpdating(true);
               const postUpdate = await updatePost(id, {
                    status: status === 'pending' || status === 'unpublished' ? 'published' : 'unpublished'
               });
               if(postUpdate) return showMainNotification('Successfully updated post status', ENotificationType.PASS);
               return showMainNotification('Failed to update post status', ENotificationType.FAIL);
          } catch (error) {
               showMainNotification('Error updating post status', ENotificationType.FAIL)
          }finally{
               setUpdating(false);
          }
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