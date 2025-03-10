'use client';

import { TVendor } from "@/common/Entities";
import Image from "next/image";
const defaultIcon = "https://weddconnect-s3.s3.eu-north-1.amazonaws.com/production/account.png";

export const AdminVendorCard = ({vendor, index}:{vendor:TVendor, index:number}) =>{
     return (
          <div className="w-full flex items-center justify-start gap-[20px] bg-white shadow-sm shadow-gray-300 rounded-[10px] p-[10px] relative">
               <span className="rounded-full flex items-center justify-center p-[2.5px] absolute top-[5px] left-[5px] bg-gray-600 text-white w-[25px] aspect-square text-[0.8rem] shadow-sm shadow-gray-400">{index}</span>
               <Image src={vendor.user?.image || defaultIcon} alt={vendor.name} width={200} height={200} className="w-[60px] border border-gray-400 aspect-square rounded-full"  />
               <div className="w-auto flex flex-col items-start gap-[10px]"> 
                    <p className="text-[1.2rem] font-bold text-gray-800">{vendor.name}</p>
               </div>
          </div>
     )
}