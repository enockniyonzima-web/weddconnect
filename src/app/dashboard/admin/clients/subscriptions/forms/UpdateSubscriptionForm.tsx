/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { ENotificationType } from '@/common/CommonTypes'
import { TSubscription } from '@/common/Entities'
import { SubmitButton, TextAreaInputGroup, TextInputGroup } from '@/components/forms/DataFormsInputs'
import { updateSubscription } from '@/server-actions/subscription.actions'
import { showMainNotification } from '@/util/NotificationFuncs'
import { CategoryFeature } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const UpdateSubscriptionForm = ({subscription }:{subscription:TSubscription}) => {
     const [loading, setLoading] = useState<boolean>(false);
     const [name,setName] = useState<string>("");
     const [price, setPrice] = useState<number>(0);
     const [description, setDescription] = useState<string>("");
     const router = useRouter()

     const saveCategory = async (event: React.FormEvent<HTMLFormElement>) =>{
          event.preventDefault();
          try{
               setLoading(true)
               const updatedSubscription = await updateSubscription(subscription.id, {
                    name: name ? name : subscription.name,
                    price: price ? Number(price) : subscription.price,
                    description: description ? description : subscription.description
               });
               if(updatedSubscription) {
                    showMainNotification("Successfully updated category", ENotificationType.PASS);
                    return router.push('/dashboard/admin/clients/subscriptions');
               }else {
                    showMainNotification("Error updating subscription. Try again later", ENotificationType.FAIL)
               }
          }catch(error){
               showMainNotification("Application Error", ENotificationType.FAIL)
          }finally{
               setLoading(false);
          }
     }
     
     return (
          <div className='w-full flex flex-col items-center justify-start gap-[10px]'>
               <form onSubmit={saveCategory} className="w-full flex items-center border rounded-[10px] p-[10px] flex-col gap-[10px]">
                    <TextInputGroup type="text" label={`Subscription Name: ${subscription.name}`} required={false} placeholder="Enter Subscription Name" name="name" action={(res) => setName(res as string)} />
                    <TextInputGroup type="number" label={`Subscription Price: ${subscription.price}`} required={false} placeholder="Enter Subscription Price" name="price" action={(res) => setPrice(res as number)} />
                    <TextAreaInputGroup maxWords={500} label="Description (max words -- 500): " required={false} placeholder='Edit subscription description' defaultValue={`${subscription.description}`} name="description" action={(res) => setDescription(res as string)}  />
                    <SubmitButton loading={loading} loadText="Updating..." label="Update Subscription" />
               </form>
          </div>
          
     )
}

const FeatureCard = ({feature, active, action}:{feature: CategoryFeature, active:boolean, action: (id:number, status: boolean) => void}) => {
     return (
          <span onClick={() => action(feature.id, active)} className={`py-2  text-center px-4 w-full text-[0.9rem] border-[1.5px] rounded-[5px] cursor-pointer ${active ? "border-blue-400 text-blue-600" :"border-gray-200 text-gray-700"} `}>{feature.name}</span>
     )
}
export default UpdateSubscriptionForm