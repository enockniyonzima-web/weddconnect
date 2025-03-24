import { TCategory } from '@/common/Entities'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";

const CategoryCard = ({category, link}:{category:TCategory, link:string}) => {
     return (
          <div className='w-full h-[80px] lg:h-[100px] flex items-center justify-between rounded-[10px] overflow-hidden shadow-sm shadow-gray-600'>
               <Image src={category.icon} alt={category.name} width={200} height={150} className='w-[15%] hidden lg:inline-flex h-full object-cover aspect-auto'/>
               <div className='w-[70%] lg:w-[65%] flex flex-col items-start justify-start gap-[5px] group px-[20px]'>
                    <h3 className='text-[1rem] md:text-[1.4rem] font-bold w-full text-center text-white'>{category.name.toUpperCase()}</h3>
                    <div className='w-full hidden lg:flex items-center justify-center'>
                         <p className='text-[0.8rem] w-full text-center text-gray-400 line-clamp-2'>{category.description}</p>
                    </div>
               </div>
               <Link href={link} prefetch className='w-[30%] lg:w-[20%] gap-[5px] flex items-center justify-center h-full bg-gradient-to-br text-[1.2rem] font-bold from-blue-600 to-blue-800 text-white text-center'>View <i className="text-[20px]"><FaArrowRightLong /></i></Link>
          </div>
     )
}

export default CategoryCard