"use client";

import { createCategory, deleteCategory, fetchCategoryById, updateCategory } from "@/server-actions/category.actions";
import { useQuery } from "@tanstack/react-query";
import { MainForm, MainFormLoader } from "./MainForm";
import { SCategory } from "@/select-types/category";
import queryClient from "@/lib/queryClient";
import { InputSize, NumberInput, TextInput } from "../ui/forms/text-input";
import { TextAreaInput } from "../ui/forms/text-area";
import { DeleteBtn } from "../ui/forms/delete-btn";
import { toast } from "sonner";
import { EditIcon, FolderTree, PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ImageUploader } from "../ui/upload/ImageUploader";
import { deleteSingleImage, uploadSingleImage } from "@/util/s3Helpers";

export const CategoryForm = ({categoryId, onComplete}:{categoryId?: number, onComplete: () => void}) => {
     const [selectedImage, setSelectedImage] = useState<File | null>(null);
     const [image,setImage] = useState("");
     const {data:categoryData, isLoading:fetchingCategory} = useQuery({
          queryKey: ["category", categoryId],
          queryFn: () => categoryId ? fetchCategoryById(categoryId, SCategory) : null
     })
     const category = categoryData ?? null;
     const isLoading  = fetchingCategory;

     const submitData = async (data: FormData): Promise<{message?: string}> => {
          const name = data.get("name") as string;
          const description = data.get("description") as string;
          const rank = Number(data.get("rank") as string);
          const newImage = selectedImage ? await uploadSingleImage(selectedImage) : null;
          if(!category) {
               if(!name || !description || isNaN(rank)) {
                    throw new Error("All fields are required and rank must be a number");
               }
               if(!newImage) throw new Error("Image is required");
               const newCategory = await createCategory({name, description, rank, icon: newImage})
               if(!newCategory) throw new Error("Failed to create category");
               onComplete();
               await queryClient.invalidateQueries();
               return {message: "Category created successfully"};
          }
          
          const updatedCategory = await updateCategory(category.id, {
               ...(name && {name}),
               ...(description && {description}),
               ...(rank && !isNaN(rank) && {rank}),
               ...(newImage && {icon: newImage}),
          });
          if(!updatedCategory) throw new Error("Failed to update category");
          onComplete();
          await queryClient.invalidateQueries();
          return {message: "Category updated successfully"};

     }
     const handleDelete = () => {
          toast.promise(
               (async () => {
                    try {
                         if(!category) throw new Error("No category to delete");
                         if(category.icon) await deleteSingleImage(category?.icon || "");
                         const res = await deleteCategory(category.id);
                         if(!res) throw new Error("Failed to delete category");
                         onComplete();
                         await queryClient.invalidateQueries();
                    } catch (error) {
                         console.log("Error deleting category:", error);
                         throw new Error("Failed to delete category");
                    }
                    
               })(),
               {
                    loading: "Deleting category...",
                    success: "Category deleted successfully",
                    error: error => error.message || "Failed to delete category"
               }
          )
     }

     useEffect(() => {
          if(category) setImage(category.icon)
     }, [category])

     if(isLoading) return <MainFormLoader />
     return (
          <div className="w-full flex items-center flex-col justify-center gap-4">
               <MainForm submitData={submitData} btnTitle={category ? "Update Category" : "Create Category"}>
                    <TextInput name="name" label="Category Name" defaultValue={category?.name ?? undefined} required={category ? false :true} />
                    <TextAreaInput name="description" label="Category Description" defaultValue={category?.description ?? undefined} />
                    <NumberInput name="rank" label="Category Rank (lower is higher priority)" defaultValue={category?.rank.toString() ?? undefined} />
                    <ImageUploader 
                         onUrlDelete={ () => setImage("")}
                         onFileDelete={ () => setSelectedImage(null)}
                         uploadToServer={false} 
                         files={[...(selectedImage ? [selectedImage]: [])]} 
                         urls={image} onSelect={file => setSelectedImage(file instanceof File ? file : null)} 
                    />
               </MainForm>
               {
                    category && 
                    <DeleteBtn 
                    label="Delete" 
                    confirmMessage="Are you sure you want to delete this category? This action cannot be undone and will remove all associated features."
                    onClick={handleDelete}
                    />
               }
          </div>
          
     )
}

export const CategoryFormBtn = ({categoryId, showBtnName, showBtnIcon, btnSize = "md"}:{categoryId?: number, showBtnName?: boolean; showBtnIcon?: boolean; btnSize?: InputSize}) => {
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
                              <div className="relative px-6 py-5"><CategoryForm categoryId={categoryId} onComplete={() => setOpen(false)} /></div>
                              <div className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-linear-to-r from-transparent via-blue-600/20 to-transparent" />
                         </DialogPanel>
                    </div>
               </Dialog>
          </>
     )
}