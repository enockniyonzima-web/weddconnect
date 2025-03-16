"use client";

import { TCategory } from "@/common/Entities"
import { useAuthContext } from "../context/AuthContext";
import { formatPrice } from "@/util/stringFuncs";
import Link from "next/link";
import defaultImage from '../../../public/images/default-image.jpg'
import Image from "next/image";

export const CategoryCard = ({category}:{category: TCategory}) => {
     const {user, setAuth}  = useAuthContext();
     const viewText = `View ${formatPrice(category._count.posts)} vendors`;
     return (
          <div className="w-full flex flex-col items-center justify-between gap-[10px] rounded-[5px] shadow-sm shadow-gray-300 overflow-hidden">
               <Image src={category.icon ? category.icon : defaultImage} alt={category.name} width={800} height={450} className="w-full aspect-video object-fill" placeholder="blur"   />
               <div className="w-full flex flex-col items-center justify-start px-[20px] gap-[5px]">
                    <h3 className="text-[0.9rem] font-bold text-black">{category.name}</h3>
                    <p className="text-[0.8rem] text-gray-600 text-center line-clamp-3">{category.description}</p>
               </div>
               {
                    !user ? 
                    <button type="button" onClick={setAuth}>{viewText}</button>:
                    <Link href={`/posts?category=${category.id}`} prefetch={true}>{viewText}</Link>
               }
          </div>
     )
}