'use client';

import { TVendor } from "@/common/Entities";
import Image from "next/image";
const defaultIcon = "https://weddconnect-s3.s3.eu-north-1.amazonaws.com/production/account.png";

export const AdminVendorCard = ({vendor, index}:{vendor:TVendor, index:number}) =>{
     return (
          <div className="w-full flex items-center justify-start gap-4 bg-gray-900 border border-gray-800 rounded-xl p-3 relative">
               <span className="rounded-full flex items-center justify-center p-[2.5px] absolute top-2 left-2 bg-gray-700 text-gray-300 w-[25px] aspect-square text-[0.8rem]">{index}</span>
               <Image src={vendor.user?.image || defaultIcon} alt={vendor.name} width={200} height={200} className="w-[60px] border border-gray-700 aspect-square rounded-full"  />
               <div className="w-auto flex flex-col items-start gap-[10px]"> 
                    <p className="text-lg font-bold text-gray-100">{vendor.name}</p>
               </div>
          </div>
     )
}