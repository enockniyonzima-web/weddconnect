/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ENotificationType } from "@/common/CommonTypes";
import { showMainNotification } from "@/util/NotificationFuncs";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { resizeImage } from "@/util/ImageFuns";
import { uploadMultipleImagesAction, uploadSingleImageAction } from "@/server-actions/fileUploader";
import { IFileUploader } from "@/common/interfaces";
import { EAspectRatio } from "@/common/enums";

interface iFileUploaderInterface {
     content: IFileUploader
}


const FileUploader: React.FC<iFileUploaderInterface> = ({content}) => {
     const [imageFile, setImageFile] = useState<Blob>();
     const [croppedImage,setCroppedImage] = useState<Blob>();
     const [imageFiles, setImageFiles] = useState<Array<Blob>>([]);
     const cropperRef = useRef<ReactCropperElement>(null);
     const cropperContainerRef = useRef<HTMLDivElement>(null);
     const cropperRefs = useRef<Array<ReactCropperElement | null>>([]);
     const [croppedImages,setCroppedImages ] = useState<Array<Blob>>([]);
     // const [uploadProgress, setUploadProgress] = useState(0);
     const [isUploading, setIsUploading] = useState(false);

     const chooseImage = () => {
          const ele = document.getElementById('image-upload-input') as HTMLInputElement ;
          ele.click();
     }

     const uploadFile = async () => {
          setIsUploading(true);
          if(croppedImage){
               showMainNotification('Uploading image...', ENotificationType.WARNING);
               const formData = new FormData();
               formData.append('file', croppedImage);
               formData.append('folder', content.uploadFolder || "development");
               const res = await uploadSingleImageAction(formData);
               if(res){
                    showMainNotification('Successfully uploaded the file', ENotificationType.PASS);
                    content.cb(res);
               }else{
                    showMainNotification("Error uploading images", ENotificationType.FAIL);
               }
               content.close();
          }else{
               showMainNotification("No Image File selected. Try again", ENotificationType.FAIL)
          }
          setIsUploading(false);
     }

     const uploadFiles = async () => {
          if(croppedImages && croppedImages.length){
               showMainNotification("uploading files", ENotificationType.WARNING);
               const formData = new FormData();
               croppedImages.forEach(file => formData.append('files', file));
               formData.append('folder', content.uploadFolder || "development");
               const res = await uploadMultipleImagesAction(formData);
               if(res) {
                    if(content.multicb)  content.multicb(res);
                    showMainNotification("Uploaded the files successfully", ENotificationType.PASS);
               }else {
                    showMainNotification("Error whle uploading the files", ENotificationType.FAIL);
               }
               content.close();
          }else {
               showMainNotification("No Files Selected. try again.", ENotificationType.FAIL);
          }
     }

     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if(content.multipleFile){
               if(e.target.files && e.target.files.length > 0){
                    const selectedFiles:Array<Blob> = Array.from(e.target.files);
                    if(content.limit && selectedFiles.length <= content.limit){
                         setImageFiles(selectedFiles);
                    }else {
                         showMainNotification(`Please select not more than ${content.limit} files `, ENotificationType.WARNING)
                    }
               }else {
                    showMainNotification("No files selected", ENotificationType.WARNING);
               }
          }else {
               if (e.target.files && e.target.files.length > 0) {
                    return setImageFile(e.target.files[0]);
               }else {
                    showMainNotification("Please select a file", ENotificationType.WARNING);
               }
          }
          
     }

     const cropImage = async () => {
          const cropper = cropperRef.current;
          if (cropper) {
               const crop = cropper.cropper;
               const croppedCanvas = crop.getCroppedCanvas({minWidth:800, maxWidth:1000});
               croppedCanvas.toBlob(
                    async (blob:any) => {
                    if (blob) {
                         const processedBlob = await resizeImage(blob);
                         setCroppedImage(processedBlob);
                    }
                    },
                 'image/webp', // Output format
                 1 // Quality
               );
          }
     };

     const cropManyImages = async () => {
          // const croppedResults: Blob[] = [];
      
          const cropPromises = cropperRefs.current.map((cropperRef) => {

              // Narrow the type to ensure it's a valid ReactCropperElement
              if (!cropperRef || !('cropper' in cropperRef)) return Promise.resolve(null);
      
              const cropperInstance = cropperRef.cropper;
              if (!cropperInstance) return Promise.resolve(null);
      
               return new Promise<Blob | null>((resolve) => {
                    const croppedCanvas = cropperInstance.getCroppedCanvas({
                         minWidth: 800,
                         maxWidth: 1000,
                    });
      
                    croppedCanvas.toBlob(async (blob) => {
                         if (blob) {
                              const processedBlob = await resizeImage(blob); // Your custom resize function
                              resolve(processedBlob);
                         } else {
                              resolve(null);
                         }
                    }, 'image/webp', 1);
               });
          });
      
          try {
              const results = await Promise.all(cropPromises);
              const validBlobs = results.filter((blob): blob is Blob => blob !== null); // Filter out null values
              setCroppedImages(validBlobs); // Update state with all cropped images
              showMainNotification('Images cropped successfully!', ENotificationType.PASS);
          } catch (error) {
              console.error('Error cropping images:', error);
              showMainNotification('Failed to crop images.', ENotificationType.FAIL);
          }
      };

     return (
          <div className='fixed z-50 top-0 left-0 w-[100vw] h-[100vh] bg-[#ffffff90] flex flex-col items-center justify-center'>
               <i className=' absolute top-[10px] left-[50%] -translate-x-[50%] text-main-warningError cursor-pointer text-[1.8rem] bg-slate-400 rounded-full p-[5px] hover:bg-slate-300 transition-all duration-150' onClick={content.close}><RxCross2 /></i>
               {
                    imageFile || croppedImage ?

                    <div className='w-[90%] h-[80%] bg-slate-400 rounded-[10px] flex flex-col items-center justify-center overflow-hidden gap-[10px]'>
                         <div className='w-[80%] h-[70%] flex flex-col items-center justify-start p-[20px] border-[1.5px] border-slate-500 rounded-[5px] '>
                              {
                                   croppedImage ?
                                   <Image width={300} height={400} className='w-auto h-auto max-w-[80%] max-h-[80%]' alt='new image upload' src={URL.createObjectURL(croppedImage)} />
                                   :imageFile ?
                                   <Cropper
                                   src={URL.createObjectURL(imageFile)}
                                   // style={{ height: 400, width: '100%' }}
                                   // Cropper.js options
                                   guides={true}
                                   aspectRatio={content.aspectRatio || EAspectRatio.STANDARD }
                                   ref={cropperRef}
                                   className="w-full h-full relative "
                              />: null
                         }
                              
                         </div>
                         <div className='w-[80%] p-[10px] rounded-[5px] gap-[20px] border-[1.5px] border-slate-500 flex flex-row items-center justify-start '>
                              <button type="button" onClick={!content.multipleFile ? uploadFile : uploadFiles} className='px-[15px] py-[10px] text-[0.8rem] font-bold text-white bg-main-orange-600 disabled:bg-main-orange-400 rounded-[5px] ' disabled={!croppedImage} >{isUploading ? "Uploading..." : "Upload"}</button>
                              <button type="button" onClick={() => {setImageFile(undefined); setCroppedImage(undefined)}} className='px-[15px] py-[10px] text-[0.8rem] font-bold text-white bg-main-orange-600 disabled:bg-main-orange-400 rounded-[5px] ' >Reset</button>
                              <button type="button" onClick={cropImage} className='px-[15px] py-[10px] text-[0.8rem] font-bold text-white bg-main-orange-600 disabled:bg-main-orange-400 rounded-[5px] ' >Crop</button>
                         </div>
                    </div>
                    : 
                    imageFiles && imageFiles.length  || croppedImages && croppedImages.length ? 
                         <div className='w-[90%] h-[80%] bg-slate-400 rounded-[10px] flex flex-col items-center justify-center overflow-hidden gap-[10px]'>
                              {
                                   croppedImages && croppedImages.length > 0 ?
                                   <div className="w-[80%] h-[70%] grid grid-cols-2 gap-[10px] md:grid-cols-3 lg:grid-cols-3 p-[20px] border-[1.5px] border-slate-500 rounded-[5px] overflow-hidden overflow-y-auto ">
                                        {
                                             croppedImages.map((file, index) => <Image key={`selected-file-image-${index}`} className="w-full aspect-auto" width={100} height={100} alt="selected-image" src={URL.createObjectURL(file)} /> )
                                        }
                                   </div>
                                   : imageFiles && imageFiles.length > 0 ?
                                   <div ref={cropperContainerRef}  className="w-[80%] h-[70%] grid grid-cols-2 gap-[10px] md:grid-cols-3 lg:grid-cols-3 p-[20px] border-[1.5px] border-slate-500 rounded-[5px] overflow-hidden overflow-y-auto ">
                                        {imageFiles.map((file, index) => 
                                             <Cropper
                                                  key={`selected-file-image-${index}`}
                                                  src={URL.createObjectURL(file)}
                                                  ref={(el) => {cropperRefs.current[index] = el as ReactCropperElement | null}}
                                                  guides={true}
                                                  aspectRatio={content.aspectRatio || EAspectRatio.STANDARD }
                                                  className="w-full h-full relative"
                                             />
                                        )}
                                   </div>
                                   :null

                              }
                              <div className='w-[80%] p-[10px] rounded-[5px] gap-[20px] border-[1.5px] border-slate-500 flex flex-row items-center justify-start '>
                                   <button type="button" onClick={!content.multipleFile ? uploadFile : uploadFiles} className='px-[15px] py-[10px] text-[0.8rem] font-bold text-white bg-main-orange-600 rounded-[5px] disabled:bg-main-orange-400 ' disabled={isUploading} >{isUploading ? "Uploading..." : "Upload"}</button>
                                   <button type="button" onClick={() => {setImageFiles([]); setCroppedImages([]);}} className='px-[15px] py-[10px] text-[0.8rem] font-bold text-white bg-main-orange-600 rounded-[5px] disabled:bg-main-orange-400 ' disabled={isUploading} >Reset</button>
                                   <button type="button" onClick={cropManyImages} className='px-[15px] py-[10px] text-[0.8rem] font-bold text-white bg-main-orange-600 rounded-[5px] disabled:bg-main-orange-400 '  disabled={isUploading} >Crop All</button>
                              </div>
                         </div>
                    :
                    <div className='w-[90%] h-[80%] bg-slate-400 rounded-[10px] flex flex-col items-center justify-center overflow-hidden gap-[10px]'>
                         <label htmlFor="image-upload-input" className='text-[1.5rem] text-slate-500 font-bold ' >{content.title}</label>
                         <input onChange={handleFileChange} type="file" name="" id="image-upload-input" className='hidden' multiple={content.multipleFile} />
                         <button onClick={chooseImage} className=' p-[20px] border-dashed border-[2px] border-slate-500 rounded-[10px] text-[1.1rem] font-bold text-slate-500 hover:border-slate-600 hover:text-slate-600 transition-all duration-150' type="button" >Upload</button>
                    </div>
               }
               
               
          </div>
     )
}

export default FileUploader