'use client';

import { VendorFormBtn } from "@/components/forms/VendorForm";
import { TVendorCard } from "@/select-types/vendor";
import { UserRound } from "lucide-react";
// const defaultIcon = "https://weddconnect-s3.s3.eu-north-1.amazonaws.com/production/account.png";

export const AdminVendorCard = ({vendor, index}:{vendor:TVendorCard, index:number}) =>{
     return (
          <div className="w-full flex flex-col items-start justify-start gap-4 bg-gray-900 border border-gray-800 rounded-xl p-3 relative">
               <span className="rounded-full flex items-center justify-center p-[2.5px] absolute top-2 left-2 bg-gray-700 text-gray-300 w-[25px] aspect-square text-[0.8rem]">{index}</span>
               <div className="flex items-center justify-start gap-2">
                    <span className="border border-blue-800 rounded-lg p-2 bg-blue-700/10">
                         <UserRound size={32} className="text-blue-200" />
                    </span>
                    <h3 className="text-gray-100 text-xl font-bold">{vendor.name}</h3>
               </div>
               <div className="w-full flex flex-col gap-2">
                    <p className="text-gray-300 text-sm line-clamp-3">{vendor.user.email}</p>
                    <div className="w-full flex items-center gap-3">
                         <p className="text-gray-400 text-sm">{vendor._count.posts} {vendor._count.posts === 1 ? "post" : "posts"}</p>
                         <p className="text-gray-400 text-sm">{vendor._count.contacts} {vendor._count.contacts === 1 ? "contact" : "contacts"}</p>
                    </div>
                    <div className="w-full flex items-start justify-end">
                         <VendorFormBtn showBtnIcon showBtnName vendorId={vendor.id} />
                    </div>
               </div>
          </div>
     )
}