/* eslint-disable @typescript-eslint/no-explicit-any */
export const getCroppedImg = async (imageSrc: string, croppedAreaPixels: any) => {
     return new Promise<string>((resolve, reject) => {
         const image = new Image();
         image.crossOrigin = "anonymous"; // Avoid CORS issues if using remote images
         image.src = imageSrc;
 
         image.onload = () => {
             const canvas = document.createElement("canvas");
             const ctx = canvas.getContext("2d");
 
             if (!ctx) {
                 reject(new Error("Failed to create canvas context"));
                 return;
             }
 
             canvas.width = croppedAreaPixels.width;
             canvas.height = croppedAreaPixels.height;
 
             ctx.drawImage(
                 image,
                 croppedAreaPixels.x,
                 croppedAreaPixels.y,
                 croppedAreaPixels.width,
                 croppedAreaPixels.height,
                 0,
                 0,
                 croppedAreaPixels.width,
                 croppedAreaPixels.height
             );
 
             canvas.toBlob((blob) => {
                 if (!blob) {
                     reject(new Error("Canvas is empty"));
                     return;
                 }
                 resolve(URL.createObjectURL(blob));
             }, "image/jpeg");
         };
 
         image.onerror = (error) => reject(error);
     });
 };
 