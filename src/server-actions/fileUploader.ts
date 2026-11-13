"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { deleteMultipleImages, deleteSingleImage, uploadMultipleImages, uploadSingleImage } from "@/util/s3Helpers";

export const uploadSingleImageAction = async (data:FormData) => {
     await requireAdmin();
     const file = data.get("file") as File;
     const folder = data.get("folder") as string;
     const imageUrl = await uploadSingleImage(file,folder);
     return imageUrl ;
};

export const uploadMultipleImagesAction = async (data:FormData) => {
     await requireAdmin();
     const files = data.getAll("files") as File[];
     const folder = data.get("folder") as string;
     const imageUrls = await uploadMultipleImages(files,folder);
     return imageUrls;
};


export const deleteSingleImageAction = async (key: string) => {
     await requireAdmin();
     await deleteSingleImage(key);
};

export const deleteMultipleImagesAction = async (keys: string[]) => {
     await requireAdmin();
     await deleteMultipleImages(keys);
};