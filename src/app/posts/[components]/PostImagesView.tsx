'use client';

import DImage from "@/components/images/Image";
import { PostImage } from "@prisma/client";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const PostImagesView = ({images}: {images: Array<PostImage>}) => {
     const [imageViewed,setImageViewed] = useState<PostImage>(images[0]);
     const [currentImage, setCurrentImage] = useState(0);
     const viewNextImage = (opt:number) => {
          if(opt === 1 && currentImage + 1 === images.length ){
               setImageViewed(images[0]);
               setCurrentImage(0);
          }else if(opt === -1 && currentImage === 0) {
               setImageViewed(images[images.length - 1]);
               setCurrentImage(images.length - 1);
          }else {
               setImageViewed(images[currentImage + opt]);
               setCurrentImage(prev => prev + opt);
          }
          
     }
     return (
          <div className="w-full  flex flex-col items-center justify-start gap-[5px]">
               <div className="w-full flex items-center justify-center relative h-auto">
                    <i className="absolute top-[50%] -translate-y-[50%] left-[5px] z-10 text-[18px] bg-black/50 text-gray-100 rounded-full p-[15px] cursor-pointer " onClick={() => viewNextImage(-1)}><IoIosArrowBack /></i>
                    <div className="bg-white w-full aspect-[4/3] rounded-[5px] overflow-hidden flex items-center justify-center py-[2px] relative ">
                         <DImage src={imageViewed.url} width={800} height={600} alt="Vehicle image" className={`w-full aspect-auto object-cover `} />
                    </div>
                    <i className="absolute top-[50%] -translate-y-[50%] right-[5px] z-10 text-[18px] bg-black/50 text-gray-100 rounded-full p-[15px] cursor-pointer " onClick={() => viewNextImage(1)} ><IoIosArrowForward /></i>
               </div>
               <div className="w-full grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-8 gap-[5px] py-[5px]">
                    {
                         images.map((image, index) => <div className="w-full" onClick={() => setImageViewed(image)} key={`vehicle-other-image-${index}`} >
                              <DImage src={image.url} width={400} height={300} alt={"vehicle image"}  className={`w-full aspect-[4/3] rounded-[5px] cursor-pointer hover:border-[1.2px] hover:border-main-orange-400 transition-all duration-200 ${index === currentImage ? "border-[1.4px] border-gray-400 p-[2.5px] " : ""} `}  />
                         </div> )
                    }
               </div>
          </div>
     )
}