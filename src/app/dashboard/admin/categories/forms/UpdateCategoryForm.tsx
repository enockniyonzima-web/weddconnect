/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { ENotificationType } from '@/common/CommonTypes'
import { TCategory } from '@/common/Entities'
import { EAspectRatio } from '@/common/enums'
import ImageUploader from '@/components/file-upload/ImageUploader'
import { SubmitButton, TextAreaInputGroup, TextInputGroup } from '@/components/forms/DataFormsInputs'
import { MaterialIcons } from '@/components/icons/material-ui-icons'
import { updateCategory } from '@/server-actions/category.actions'
import { deleteSingleImageAction } from '@/server-actions/fileUploader'
import { showMainNotification } from '@/util/NotificationFuncs'
import { CategoryFeature } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const UpdateCategoryForm = ({category, features}:{category:TCategory, features: CategoryFeature[]}) => {
     const [loading, setLoading] = useState<boolean>(false);
     const [name,setName] = useState<string>("");
     const [description, setDescription] = useState<string>("");
     const router = useRouter()

     const saveCategory = async (event: React.FormEvent<HTMLFormElement>) =>{
          event.preventDefault();
          try{
               setLoading(true)
               const updatedCategory = await updateCategory(category.id, {
                    name: name ? name : category.name,
                    description: description ? description : category.description
               });
               if(updatedCategory) {
                    showMainNotification("Successfully updated category", ENotificationType.PASS);
                    return router.push('/dashboard/admin/categories');
               }else {
                    showMainNotification("Error updating category. Try again later", ENotificationType.FAIL)
               }
          }catch(error){
               showMainNotification("Application Error", ENotificationType.FAIL)
          }finally{
               setLoading(false);
          }
     }
     const toggleCategoryFeature = async (featureId:number, status:boolean) => {
          try{
               const update = !status ?  await updateCategory(category.id, {
                    features: {
                         connect: {id: featureId}
                    }
               }) : await updateCategory(category.id, {
                    features: {
                         disconnect: {id: featureId}
                    }
               });
               console.log(update)
               if(update) showMainNotification(`${!status ? "Feature added" : "Feature Removed"}`, ENotificationType.PASS);
               else showMainNotification("Error updating category features, Try again", ENotificationType.FAIL)
          }catch(error) {
               showMainNotification('Error adding the feature', ENotificationType.FAIL)
          }

     }
     const updateImage =async (image:string) => {
          try {
               showMainNotification("Adding Image...", ENotificationType.WARNING);
               const categoryUpdate = await updateCategory(category.id, {icon:image});
               if(categoryUpdate) return showMainNotification('Image added successfully',ENotificationType.PASS);
               else return showMainNotification('Failed to add category image', ENotificationType.FAIL)
          } catch (error) {
               showMainNotification('Error updating category image', ENotificationType.FAIL)
          }
     }
     const deleteImage = async (imageDeleted:string) => {
               showMainNotification("Deleting the image...", ENotificationType.WARNING);
               try {
                    const categoryUpdate =  await updateCategory(category.id, {icon: ""})
                    
                    if(categoryUpdate) {
                         await deleteSingleImageAction(imageDeleted);
                         return showMainNotification("Image deleted successfully", ENotificationType.PASS);
                    }else {
                         return showMainNotification("Error deleting category Image", ENotificationType.FAIL)
                    }
               } catch (error) {
                    showMainNotification("Error deleting the image!!", ENotificationType.FAIL)
               }
          }
     return (
          <div className='w-full flex flex-col items-center justify-start gap-[10px]'>
               <form onSubmit={saveCategory} className="w-full flex items-center border rounded-[10px] p-[10px] flex-col gap-[10px]">
                    <TextInputGroup type="text" label={`Category Name: ${category.name}`} required={false} placeholder="Enter Category Name" name="name" action={(res) => setName(res as string)} />
                    <TextAreaInputGroup maxWords={200} label="Description (max words -- 200): " required={false} placeholder='Add category description' defaultValue={`${category.description}`} name="description" action={(res) => setDescription(res as string)}  />
                    <SubmitButton loading={loading} loadText="Updating..." label="Update Category" />
               </form>
               <div className='w-full flex flex-col items-center justify-start gap-[5px]'>
                    <h1 className='w-full text-[1.2rem] font-bold text-gray-800'>Manage Features</h1>
                    <div className='w-full grid grid-cols-2 lg:grid-cols-4 gap-[10px]'>
                         {
                              features.map((feature, index)=> <FeatureCard feature={feature} key={`category-feature-${index}`} active={category.features.find(f => f.id === feature.id) ? true : false} action={toggleCategoryFeature} /> )
                         }
                    </div>
               </div>
               <div className='w-full flex flex-col items-center justify-start gap-[5px]'>
                    <h1 className='w-full text-[1.2rem] font-bold text-gray-800'>Category Image:</h1>
                    {
                         category.icon ?
                         <div className="w-full lg:w-[500px] flex flex-col items-center justify-start gap-[5px] relative">
                              <Image  width={400} height={300} src={category.icon} alt="Listing-update image" layout="responsive" className="w-full rounded-[5px] aspect-auto" />
                              <button type='button' title="Delete image" className="absolute top-0 right-0 bg-gray-100 rounded-[2.5px] p-[2px] cursor-pointer" onClick={async() => await deleteImage(category.icon)}>
                                   <MaterialIcons.delete className="text-red-700 hover:text-red-600 text-[20px] " titleAccess="delete image" />
                              </button>
                         </div>:
                         <div className='w-full flex items-center justify-start'>
                         <ImageUploader onUploadComplete={updateImage} aspect={EAspectRatio.WIDESCREEN} />
                    </div>
                    }
               </div>
          </div>
          
     )
}

const FeatureCard = ({feature, active, action}:{feature: CategoryFeature, active:boolean, action: (id:number, status: boolean) => void}) => {
     return (
          <span onClick={() => action(feature.id, active)} className={`py-2  text-center px-4 w-full text-[0.9rem] border-[1.5px] rounded-[5px] cursor-pointer ${active ? "border-blue-400 text-blue-600" :"border-gray-200 text-gray-700"} `}>{feature.name}</span>
     )
}
export default UpdateCategoryForm