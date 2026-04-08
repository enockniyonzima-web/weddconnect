"use client";

import { ENotificationType } from "@/common/CommonTypes";
import { TCategory } from "@/common/Entities";
import { EAspectRatio } from "@/common/enums";
import ImageUploader from "@/components/file-upload/ImageUploader";
import { SubmitButton, TextAreaInputGroup, TextInputGroup } from "@/components/forms/DataFormsInputs";
import { MaterialIcons } from "@/components/icons/material-ui-icons";
import { createCategory, deleteCategory, updateCategory } from "@/server-actions/category.actions";
import { deleteSingleImageAction } from "@/server-actions/fileUploader";
import { showMainNotification } from "@/util/NotificationFuncs";
import { CategoryFeature } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface CategoryFormProps {
     category?: TCategory | null;
     features?: CategoryFeature[];
}

export default function CategoryForm({ category, features = [] }: CategoryFormProps) {
     const isUpdate = !!category;
     const router = useRouter();

     const [loading, setLoading] = useState(false);
     const [deleting, setDeleting] = useState(false);
     const [name, setName] = useState(category?.name ?? "");
     const [description, setDescription] = useState(category?.description ?? "");
     const [icon, setIcon] = useState(category?.icon ?? "");
     const [rank, setRank] = useState(category?.rank ?? 0);

     const redirectBack = () => {
          router.prefetch("/dashboard/admin/categories");
          router.push("/dashboard/admin/categories");
     };

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          try {
               setLoading(true);
               if (isUpdate && category) {
                    showMainNotification("Updating category...", ENotificationType.WARNING);
                    const res = await updateCategory(category.id, {
                         name: name || category.name,
                         description: description || category.description,
                         rank,
                         icon,
                    });
                    if (res) {
                         showMainNotification("Category updated successfully", ENotificationType.PASS);
                         return redirectBack();
                    }
                    showMainNotification("Error updating category", ENotificationType.FAIL);
               } else {
                    showMainNotification("Saving new category...", ENotificationType.WARNING);
                    const res = await createCategory({ name, description, status: true, icon, rank });
                    if (res) {
                         showMainNotification("Category saved successfully", ENotificationType.PASS);
                         return redirectBack();
                    }
                    showMainNotification("Error saving category", ENotificationType.FAIL);
               }
          } catch {
               showMainNotification("Something went wrong", ENotificationType.FAIL);
          } finally {
               setLoading(false);
          }
     };

     const handleDelete = async () => {
          if (!category) return;
          if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;
          try {
               setDeleting(true);
               showMainNotification("Deleting category...", ENotificationType.WARNING);
               if (category.icon) await deleteSingleImageAction(category.icon);
               const res = await deleteCategory(category.id);
               if (res) {
                    showMainNotification("Category deleted", ENotificationType.PASS);
                    return redirectBack();
               }
               showMainNotification("Error deleting category", ENotificationType.FAIL);
          } catch {
               showMainNotification("Something went wrong", ENotificationType.FAIL);
          } finally {
               setDeleting(false);
          }
     };

     const toggleFeature = async (featureId: number, isActive: boolean) => {
          if (!category) return;
          try {
               const res = isActive
                    ? await updateCategory(category.id, { features: { disconnect: { id: featureId } } })
                    : await updateCategory(category.id, { features: { connect: { id: featureId } } });
               if (res) showMainNotification(isActive ? "Feature removed" : "Feature added", ENotificationType.PASS);
               else showMainNotification("Error updating features", ENotificationType.FAIL);
          } catch {
               showMainNotification("Error toggling feature", ENotificationType.FAIL);
          }
     };

     const handleImageUpload = async (image: string) => {
          if (isUpdate && category) {
               try {
                    showMainNotification("Adding image...", ENotificationType.WARNING);
                    const res = await updateCategory(category.id, { icon: image });
                    if (res) {
                         setIcon(image);
                         return showMainNotification("Image added", ENotificationType.PASS);
                    }
                    showMainNotification("Failed to add image", ENotificationType.FAIL);
               } catch {
                    showMainNotification("Error uploading image", ENotificationType.FAIL);
               }
          } else {
               setIcon(image);
          }
     };

     const handleImageDelete = async () => {
          if (!icon) return;
          try {
               showMainNotification("Deleting image...", ENotificationType.WARNING);
               if (isUpdate && category) {
                    const res = await updateCategory(category.id, { icon: "" });
                    if (!res) return showMainNotification("Error deleting image", ENotificationType.FAIL);
               }
               await deleteSingleImageAction(icon);
               setIcon("");
               showMainNotification("Image deleted", ENotificationType.PASS);
          } catch {
               showMainNotification("Error deleting image", ENotificationType.FAIL);
          }
     };

     return (
          <div className="w-full flex flex-col gap-5">
               {/* Main Form */}
               <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 border border-gray-800 rounded-xl p-4">
                    <TextInputGroup
                         type="text"
                         label="Category Name"
                         placeholder="Enter Category Name"
                         name="name"
                         required={!isUpdate}
                         defaultValue={category?.name}
                         action={(res) => setName(res as string)}
                    />
                    <TextAreaInputGroup
                         maxWords={200}
                         label="Description (max 200 words)"
                         placeholder="Enter Description"
                         name="description"
                         required={!isUpdate}
                         defaultValue={category?.description}
                         action={(res) => setDescription(res as string)}
                    />
                    <TextInputGroup
                         type="number"
                         label="Rank (higher = higher priority)"
                         placeholder="0"
                         name="rank"
                         required={false}
                         defaultValue={String(category?.rank ?? 0)}
                         action={(res) => setRank(Number(res))}
                    />

                    {/* Image Section */}
                    <div className="w-full flex flex-col gap-2">
                         <label className="text-sm font-medium text-gray-300">Category Icon</label>
                         {icon ? (
                              <div className="relative w-full max-w-md">
                                   <Image
                                        width={400}
                                        height={300}
                                        src={icon}
                                        alt="Category icon"
                                        className="w-full rounded-lg aspect-video object-cover border border-gray-700"
                                   />
                                   <button
                                        type="button"
                                        title="Delete image"
                                        className="absolute top-2 right-2 bg-gray-900/80 hover:bg-red-600/80 rounded-lg p-1.5 cursor-pointer transition-colors"
                                        onClick={handleImageDelete}
                                   >
                                        <MaterialIcons.delete className="text-red-400 hover:text-white text-lg" titleAccess="Delete image" />
                                   </button>
                              </div>
                         ) : (
                              <ImageUploader onUploadComplete={handleImageUpload} aspect={EAspectRatio.WIDESCREEN} />
                         )}
                    </div>

                    <div className="flex items-center gap-3">
                         <SubmitButton
                              loading={loading}
                              loadText={isUpdate ? "Updating..." : "Saving..."}
                              label={isUpdate ? "Update Category" : "Save Category"}
                         />
                         {isUpdate && (
                              <button
                                   type="button"
                                   disabled={deleting}
                                   onClick={handleDelete}
                                   className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-600/20 hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                   <Trash2 size={16} />
                                   {deleting ? "Deleting..." : "Delete"}
                              </button>
                         )}
                    </div>
               </form>

               {/* Feature Management (update mode only) */}
               {isUpdate && category && features.length > 0 && (
                    <div className="w-full flex flex-col gap-3 border border-gray-800 rounded-xl p-4">
                         <h2 className="text-lg font-bold text-gray-100">Manage Features</h2>
                         <p className="text-sm text-gray-400">Toggle features on/off for this category</p>
                         <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                              {features.map((feature) => {
                                   const isActive = category.features.some((f) => f.id === feature.id);
                                   return (
                                        <button
                                             key={feature.id}
                                             type="button"
                                             onClick={() => toggleFeature(feature.id, isActive)}
                                             className={`py-2 px-3 text-sm rounded-lg border cursor-pointer transition-all text-center truncate ${
                                                  isActive
                                                       ? "border-blue-500 bg-blue-600/10 text-blue-400"
                                                       : "border-gray-700 bg-gray-800/50 text-gray-500 hover:border-gray-600 hover:text-gray-400"
                                             }`}
                                        >
                                             {feature.name}
                                        </button>
                                   );
                              })}
                         </div>
                    </div>
               )}
          </div>
     );
}