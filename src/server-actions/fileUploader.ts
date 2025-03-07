"use server";

import { deleteMultipleImages, deleteSingleImage, uploadMultipleImages, uploadSingleImage } from "@/util/s3Helpers";

export const uploadSingleImageAction = async (data:FormData) => {
     const file = data.get("file") as File;
     const folder = data.get("folder") as string;
     const imageUrl = await uploadSingleImage(file,folder);
     return imageUrl ;
};

export const uploadMultipleImagesAction = async (data:FormData) => {
     const files = data.getAll("files") as File[];
     const folder = data.get("folder") as string;
     const imageUrls = await uploadMultipleImages(files,folder);
     return imageUrls;
};


export const deleteSingleImageAction = async (key: string) => {
     await deleteSingleImage(key);
};

export const deleteMultipleImagesAction = async (keys: string[]) => {
     await deleteMultipleImages(keys);
};