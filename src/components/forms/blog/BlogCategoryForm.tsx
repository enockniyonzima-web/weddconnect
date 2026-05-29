"use client";

import { createBlogCategory, deleteBlogCategory, fetchBlogCategoryById, updateBlogCategory } from "@/server-actions/blog/blog-category";
import { useQuery } from "@tanstack/react-query";
import { MainForm, MainFormLoader } from "../MainForm";
import queryClient from "@/lib/queryClient";
import { InputSize, TextInput } from "@/components/ui/forms/text-input";
import { TextAreaInput } from "@/components/ui/forms/text-area";
import { DeleteBtn } from "@/components/ui/forms/delete-btn";
import { toast } from "sonner";
import { EditIcon, FolderTree, PlusIcon, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";

export const BlogCategoryForm = ({id, onComplete}:{id?:string, onComplete: () => void}) => {
     const {data: categoryData, isLoading} = useQuery({
          queryKey: ["blog-category", id],
          queryFn: () => fetchBlogCategoryById(id!, {id: true, name: true, description: true}),
          enabled: !!id
     });
     const category = categoryData ?? null;
     const submitData = async (data: FormData): Promise<{message?: string}> => {
          const name = data.get("name") as string;
          const description = data.get("description") as string;
          const slug = name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') : '';
          if(!id) {
               if(!name) throw new Error("Category Name is required");
               const newCategory = await createBlogCategory({
                    name, description, slug
               });
               if(!newCategory) throw new Error("Error creating category");
               onComplete();
               queryClient.invalidateQueries();
               return {message: "Category created successfully"};
          }
          const updatedCategory = await updateBlogCategory(id, {
               ...(name && {name, slug}),
               ...(description && {description})
          })
          if(!updatedCategory) throw new Error("Error updating the category");
          onComplete();
          queryClient.invalidateQueries();
          return {message: "Category updated successfully"};
     }
     const handleDelete = async () => {
          toast.promise(
               (async () => {
                    if(!category) throw new Error("The category does not exist in the system!");
                    const res = await deleteBlogCategory(category.id);
                    if(!res) throw new Error("Server Error deleting the category!");
                    onComplete();
                    await queryClient.invalidateQueries();
               })(),
               {
                    loading: "Deleting blog category...",
                    success: "Category Deleted Successfully",
                    error: error => error.message ?? "Failed to delete the category"
               }
          )
          
     }
     if(isLoading) return <MainFormLoader />
     return (
          <div className="w-full flex flex-col gap-4">
               <MainForm submitData={submitData} btnTitle={category ? "Update Category" : "Create Category"}>
                    <TextInput name="name" defaultValue={category?.name} placeholder="ex Technology" required={category ? false: true} label="Category Name:" />
                    <TextAreaInput name="description" defaultValue={category?.description} placeholder="ex Technology is..." required={false} label="Category Description:" />
               </MainForm>
               {id && <DeleteBtn onClick={handleDelete} title="Delete Category" confirmMessage="Are you sure you want to delete this category?" confirmTitle="Delete" />}
          </div>
     )
}

export const BlogCategoryFormBtn = ({categoryId, showBtnName, showBtnIcon, btnSize = "md"}:{categoryId?: string, showBtnName?: boolean; showBtnIcon?: boolean; btnSize?: InputSize}) => {
     const btnTitle = showBtnName ? categoryId ? "Edit" : "Create" : undefined;
     const Icon = categoryId ? EditIcon : PlusIcon;
     const [open,setOpen] = useState(false);
     const sizeClasses: Record<InputSize, string> = { sm: "h-8 px-3 text-xs gap-1.5", md: "h-10 px-4 text-sm gap-2", lg: "h-12 px-5 text-base gap-2" };
     const iconSizes: Record<InputSize, number> = { sm: 14, md: 16, lg: 18 };

     return (
          <>
               <button type="button" onClick={() => setOpen(true)} className={cn("inline-flex items-center justify-center rounded-lg font-medium cursor-pointer transition-all duration-200 active:scale-[0.97]", sizeClasses[btnSize], categoryId ? "border border-white/10 bg-blue-700 text-gray-100 hover:border-blue-700/30 hover:text-white" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500")}>
                    {showBtnIcon && <Icon size={iconSizes[btnSize]} strokeWidth={2} className="shrink-0" />}
                    {showBtnName && <span>{btnTitle}</span>}
               </button>
               <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                         <DialogPanel className="relative w-[92vw] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/50">
                              <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-linear-to-r from-blue-600 via-blue-500 to-blue-900" />
                              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true"><div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue-600/5 blur-3xl" /><div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-900/10 blur-3xl" /></div>
                              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/5 bg-gray-900/95 backdrop-blur-md px-6 py-4 rounded-t-2xl">
                                   <div className="flex items-center gap-3">
                                        <div className={cn("flex items-center justify-center h-9 w-9 rounded-lg", categoryId ? "bg-blue-600/10 border border-blue-600/20 text-blue-600" : "bg-blue-600 text-white shadow-md shadow-blue-600/25")}><FolderTree size={18} strokeWidth={2} /></div>
                                        <div><h3 className="text-base font-semibold text-white">{categoryId ? "Edit Category" : "Create Category"}</h3><p className="text-xs text-gray-400">{categoryId ? "Update Category details" : "Create a new Category"}</p></div>
                                   </div>
                                   <button type="button" onClick={() => setOpen(false)} title="Close" className="flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-gray-400 cursor-pointer transition-all hover:bg-white/10 hover:text-white hover:border-white/20"><X size={16} strokeWidth={2} /></button>
                              </div>
                              <div className="relative px-6 py-5"><BlogCategoryForm id={categoryId} onComplete={() => setOpen(false)} /></div>
                              <div className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-linear-to-r from-transparent via-blue-600/20 to-transparent" />
                         </DialogPanel>
                    </div>
               </Dialog>
          </>
     )
}