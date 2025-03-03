/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ENotificationType } from "@/common/CommonTypes";
import { SubmitButton, TextAreaInputGroup, TextInputGroup } from "@/components/forms/DataFormsInputs"
import { createCategory } from "@/server-actions/category.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { useRouter } from "next/navigation";
import { useState } from "react";

function AddCategoryForm() {
     const [loading, setLoading] = useState<boolean>(false);

     const [name,setName] = useState<string>("");
     const [description, setDescription] = useState<string>("");
     const router = useRouter()

     const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setLoading(true);
               showMainNotification("Saving new category...", ENotificationType.WARNING);
               const savedCategory = await createCategory({
                    name, description, status:true
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
     return (
          <form onSubmit={saveCategory} className="w-full flex items-center border rounded-[10px] p-[10px] flex-col gap-[10px]">
               <TextInputGroup type="text" label="Category Name" placeholder="Enter Category Name" name="name" required action={(res) => setName(res as string)} />
               <TextAreaInputGroup maxWords={200} label="Description (max words -- 200): " placeholder="Enter Description" name="description" required action={(res) => setDescription(res as string)}  />
               <SubmitButton loading={loading} loadText="Saving..." label="Save Category" />
          </form>
     )
}

export default AddCategoryForm