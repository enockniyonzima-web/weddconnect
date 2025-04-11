/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { TrendCard } from "./TrendCard";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const TrendingCardsSection = ({images}:{images:StaticImport[]}) => {
     const sliderRef = useRef<HTMLDivElement>(null);
     const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

     const updateScrollButtons = () => {
          if (sliderRef.current) {
               setCanScrollLeft(sliderRef.current.scrollLeft > 0);
               setCanScrollRight(sliderRef.current.scrollLeft < sliderRef.current.scrollWidth - sliderRef.current.clientWidth);
          }
     };

     const scrollContainer = (opt: number) => {
          if (sliderRef.current) {
          const scrollAmount = window.innerWidth * 0.4; // 40% of viewport width
          const  newScrollLeft = sliderRef.current.scrollLeft + opt * scrollAmount;

               sliderRef.current.scrollTo({
                    left: newScrollLeft,
                    behavior: "smooth",
               });
          }
     };

     useEffect(() => {
          updateScrollButtons();
          if (sliderRef.current) {
               sliderRef.current.addEventListener("scroll", updateScrollButtons);
          }
          return () => {
               if (sliderRef.current) {
                    sliderRef.current.removeEventListener("scroll", updateScrollButtons);
               }
          };
     }, []);
     
     return (
          <div className="w-full flex items-center justify-between overflow-hidden gap-[20px]">
               {canScrollLeft ? 
                    <i
                         className="inline-flex text-white bg-gradient-to-bl from-gray-600  to-gray-800 cursor-pointer rounded-[10px] px-[5px] h-[100px] text-[20px] items-center justify-center"
                         onClick={() => scrollContainer(-1)}
                    ><IoIosArrowBack /></i> :
                    <i
                         className="inline-flex text-white bg-gradient-to-bl from-gray-400 cursor-not-allowed to-gray-600 rounded-[10px] px-[5px] h-[100px] text-[20px] items-center justify-center"
                    ><IoIosArrowBack /></i>
               }
               <div className="w-full overflow-hidden relative overflow-x-auto scroll-smooth scrollbar-hide" ref={sliderRef}>
                    <div className="relative w-full cursor-pointer grid grid-flow-col auto-cols-[80%]  lg:auto-cols-[30%] gap-[40px]">
                         {
                              images.map((image, index) => <TrendCard key={`trending-card-${index}`} image={image} />)
                         }
                    </div>
               </div>
               {canScrollRight ?
                    <i
                         className="inline-flex text-white bg-gradient-to-bl cursor-pointer from-gray-600 to-gray-800 rounded-[10px] px-[5px] h-[100px] text-[20px] items-center justify-center"
                         onClick={() => scrollContainer(1)}
                    ><IoIosArrowForward /></i>:
                    <i
                         className="inline-flex text-white bg-gradient-to-bl from-gray-400 cursor-not-allowed to-gray-600 rounded-[10px] px-[5px] h-[100px] text-[20px] items-center justify-center"
                    ><IoIosArrowForward /></i>

               }
          </div>
          
     )
}