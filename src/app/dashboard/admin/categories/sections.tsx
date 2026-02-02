import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-3 py-3">
               <h1 className="text-[1.6rem] text-black font-bold w-full text-start leading-3">Categories</h1>
               <div className="w-full flex items-end justify-between flex-wrap gap-2">
                    <p className="text-sm text-gray-600">Manage posts categories and features</p>
                    <Link className="bg-blue-600 text-base font-medium rounded-[5px] whitespace-nowrap hover:bg-blue-800 py-2 px-4 text-white flex items-center gap-[5px]" prefetch={true} href={'/dashboard/admin/categories?form=add'} ><i className="text-[18px]"><FaPlus /></i>New Category</Link>
               </div>
          </div>
     )
}