'use client';

import React, {  useRef } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
// import { OptimizedImage } from './OptImage';
import Image from 'next/image';
import Link from 'next/link';
import { PostImage } from '@prisma/client';
import DefaultImage from '../../../public/images/default-image.jpg'

interface IImageSlider{
     images: PostImage[]
     onClick?: () => void,
     link?:string
     label?: string
}

const ImageSlider:React.FC<IImageSlider> = ({images, onClick,link ,label}) => {
     const sliderRef = useRef<HTMLDivElement>(null);

     const viewNextImage = (opt:number) => {
          
          if (sliderRef.current) {
               const scrollAmount = sliderRef.current.clientWidth; // Width of the container
               const maxScrollLeft = sliderRef.current.scrollWidth - scrollAmount; // Maximum scrollable distance
               const currentScrollLeft = sliderRef.current.scrollLeft; // Current scroll position
               let newScrollLeft = currentScrollLeft + opt * scrollAmount;
          
               // Handle edge cases for looping
               if (newScrollLeft > maxScrollLeft) {
                    newScrollLeft = 0; // Loop back to the start
               } else if (newScrollLeft < 0) {
                    newScrollLeft = maxScrollLeft; // Loop to the end
               }
          
               sliderRef.current.scrollTo({
                    left: newScrollLeft,
                    behavior: 'smooth',
               });
          }
          
     }
     
     return (
          <div className="relative w-full h-auto ">
               {images.length > 1 &&<i className="hidden lg:inline-flex absolute top-[50%] -translate-y-[50%] left-[5px] z-10 text-[18px] bg-black/50 hover:bg-black/70 text-gray-200 rounded-full p-[5px] cursor-pointer " onClick={() => viewNextImage(-1)}><IoIosArrowBack /></i>}
               {
                    images.length > 0 ? 
                    <div className='w-full  overflow-hidden overflow-x-auto lg:overflow-x-hidden scroll-smooth scrollbar-hide' ref={sliderRef}>
                         <div className='relative w-full aspect-video object-cover cursor-pointer  grid grid-flow-col auto-cols-[100%] gap-[4px] ' onClick={onClick}>
                              {
                                   images.map((image, index) => 
                                        <Link className='w-full aspect-[4/3] relative bg-gray-200' key={`listing-image-${index}`} href={link || ''} aria-label={label}>
                                             <Image src={image.url} placeholder='empty'  fill alt="listing image" className=' object-cover cursor-pointer' />
                                        </Link>
                                        // <OptimizedImage url={image.url} key={`listing-image-${index}`}  alt="listing image" />
                                   )
                              }
                         </div>
                    </div>:
                    <Image src={DefaultImage} alt='No image found' width={400} height={300} className='w-full aspect-video' />
               }
               
               
               {images.length > 1 && <i className="hidden lg:inline-flex absolute top-[50%] -translate-y-[50%] right-[5px] z-10 text-[18px] bg-black/50 hover:bg-black/70 text-gray-200 rounded-full p-[5px] cursor-pointer " onClick={() => viewNextImage(1)} ><IoIosArrowForward /></i>}
          </div>
     )
}

export default ImageSlider