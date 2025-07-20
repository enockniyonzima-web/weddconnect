/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ENotificationType } from "@/common/CommonTypes";
import { EAspectRatio } from "@/common/enums";
import ImageUploader from "@/components/file-upload/ImageUploader";
import { SubmitButton, TextAreaInputGroup, TextInputGroup } from "@/components/forms/DataFormsInputs"
import { MaterialIcons } from "@/components/icons/material-ui-icons";
import Image from "@/components/ui/Image";
import { createCategory } from "@/server-actions/category.actions";
import { deleteSingleImageAction } from "@/server-actions/fileUploader";
import { showMainNotification } from "@/util/NotificationFuncs";
import { useRouter } from "next/navigation";
import { useState } from "react";

function AddCategoryForm() {
     const [loading, setLoading] = useState<boolean>(false);

     const [name,setName] = useState<string>("");
     const [description, setDescription] = useState<string>("");
     const [icon, setIcon] = useState<string>("");
     const router = useRouter()

     const updateIcon = (res:string) => {
          return setIcon(res)
     }

     const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setLoading(true);
               showMainNotification("Saving new category...", ENotificationType.WARNING);
               const savedCategory = await createCategory({
                    name, description, status:true, icon
               });
               
               if(savedCategory) {
                    showMainNotification("Category Saved successfully", ENotificationType.PASS);
                    router.prefetch('/dashboard/admin/categories');
                    return router.push('/dashboard/admin/categories');
               }
          } catch (error) {
               showMainNotification("Error saving the category", ENotificationType.FAIL)
          }finally{
               setLoading(false);
          }
     }

     const deleteImage = async (imageDeleted:string) => {
                    showMainNotification("Deleting the image...", ENotificationType.WARNING);
                    try {
                         await deleteSingleImageAction(imageDeleted);
                         return showMainNotification("Image deleted successfully", ENotificationType.PASS);
                    
                    } catch (error) {
                         showMainNotification("Error deleting the image!!", ENotificationType.FAIL)
                    }
               }
     return (
          <form onSubmit={saveCategory} className="w-full flex items-center border rounded-[10px] p-[10px] flex-col gap-[10px]">
               <TextInputGroup type="text" label="Category Name" placeholder="Enter Category Name" name="name" required action={(res) => setName(res as string)} />
               <TextAreaInputGroup maxWords={200} label="Description (max words -- 200): " placeholder="Enter Description" name="description" required action={(res) => setDescription(res as string)}  />
               {
                         icon ?
                         <div className="w-full lg:w-[500px] flex flex-col items-center justify-start gap-[5px] relative">
                              <Image  width={400} height={300} src={icon} alt="Listing-update image" className="w-full rounded-[5px] aspect-auto" />
                              <button type='button' title="Delete image" className="absolute top-0 right-0 bg-gray-100 rounded-[2.5px] p-[2px] cursor-pointer" onClick={async() => await deleteImage(icon)}>
                                   <MaterialIcons.delete className="text-red-700 hover:text-red-600 text-[20px] " titleAccess="delete image" />
                              </button>
                         </div>:
                         <div className='w-full flex items-center justify-start'>
                         <ImageUploader onUploadComplete={updateIcon} aspect={EAspectRatio.WIDESCREEN} />
                    </div>
                    }
               <SubmitButton loading={loading} loadText="Saving..." label="Save Category" />
          </form>
     )
}

export default AddCategoryForm