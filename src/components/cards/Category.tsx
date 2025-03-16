"use client";

import { TCategory } from "@/common/Entities"
import { useAuthContext } from "../context/AuthContext";
// import { formatPrice } from "@/util/stringFuncs";
import Link from "next/link";
import defaultImage from '../../../public/images/default-image.jpg'
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";

export const CategoryCard = ({category}:{category: TCategory}) => {
     const {user, setAuth}  = useAuthContext();
     // const viewText = `View ${formatPrice(category._count.posts)} vendors`;
     const viewText = `View vendors`;
     return (
          <div className="w-full flex flex-col items-center bg-white justify-between gap-[10px] rounded-[5px] shadow-sm shadow-gray-300 overflow-hidden">
               <Image src={category.icon ? category.icon : defaultImage} alt={category.name} width={800} height={450} className="w-full aspect-video object-fill" placeholder="empty"   />
               <div className="w-full flex flex-col items-center justify-start px-[10px] gap-[5px]">
                    <h3 className="text-[1.1rem] font-bold text-black">{category.name}</h3>
                    <p className="text-[0.8rem] text-gray-600 text-center line-clamp-3">{category.description}</p>
               </div>
               <div className="w-full py-[5px] flex items-center justify-center">
                    {
                         !user ? 
                         <button className="text-center w-auto py-[7.5px] bg-white border-[1.3px] font-semibold border-blue-600 text-blue flex items-center gap-[5px] rounded-[30px] text-[1rem] text-blue-800 px-[20px]" type="button" onClick={setAuth}>{viewText} <i className="text-[22px] font-normal"><FaArrowRight /></i></button>:
                         <Link className="text-center w-auto py-[7.5px] bg-white border-[1.3px] font-semibold border-blue-600 text-blue flex items-center gap-[5px] rounded-[30px] text-[1rem] text-blue-800 px-[20px]" href={`/posts?category=${category.id}`} prefetch={true}>{viewText} <i className="text-[22px]"><FaArrowRight /></i></Link>
                    }
               </div>
          </div>
     )
}