/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ENotificationType } from "@/common/CommonTypes";
import { SubmitButton, TextInputGroup } from "@/components/forms/DataFormsInputs";
import { updatePost } from "@/server-actions/post.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { DataInputs } from "@/util/util-classes";
import { PostPrice } from "@prisma/client";
import { ChangeEvent, useState } from "react"

export const FormPriceForm = ({postId, postPrice}:{postId:number, postPrice: PostPrice | null}) => {
     const [updating, setUpdating] = useState(false);
     const priceInputs = new DataInputs();
     const updatePrice = async (event:ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          try{
               setUpdating(true)
               const checkInputs  = priceInputs.checkFieldsIn(['min','max'] );
               if(!checkInputs.status) return showMainNotification(checkInputs.message, ENotificationType.WARNING);
               const postUpdate = postPrice === null ? 
                    await updatePost(postId, {price: {create:{min: priceInputs.get('min', 0), max: priceInputs.get('max', 0), currency:'Rwf'}}}) :
                    await updatePost(postId, {price: {update: {min: priceInputs.get('min', postPrice.min), max: priceInputs.get('max', postPrice.max), currency: 'Rwf'}}});
               if(postUpdate) return showMainNotification('Updated post price successfully', ENotificationType.PASS);
               else return showMainNotification('Error updating post price', ENotificationType.FAIL);
          }catch(error) {
               return showMainNotification('Error updating post price', ENotificationType.FAIL);
          }finally{
               setUpdating(false);
          }
     }
     return (
          <div className="w-full flex flex-col items-center justify-start gap-[10px]">
               <h2 className="w-full text-[0.9rem] font-bold text-gray-700">Price Information:</h2>
               <form className="w-full grid grid-cols-2 gap-[10px]" onSubmit={updatePrice}>
                    <TextInputGroup type="number" label="Min Price: " placeholder="ex: 20000.." name="min-price" action={(res) => priceInputs.set('min', Number(res), 'number')}   />
                    <TextInputGroup type="number" label="Max Price:(enter 0 for more) " placeholder="ex: 50000 ... or enter 0 for more" name="max-price" action={(res) => priceInputs.set('max', Number(res), 'number')}   />
                    <SubmitButton label="Update Price" loadText="Updating..." loading={updating} />
               </form>
          </div>
     )
} 