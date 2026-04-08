import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-3 py-3">
               <h1 className="text-2xl text-white font-bold w-full text-start">Categories</h1>
               <div className="w-full flex items-end justify-between flex-wrap gap-2">
                    <p className="text-sm text-gray-400">Manage posts categories and features</p>
                    <Link className="bg-blue-600 text-sm font-medium rounded-lg whitespace-nowrap hover:bg-blue-500 py-2 px-4 text-white flex items-center gap-2 transition-colors" prefetch={true} href={'/dashboard/admin/categories?form=add'} ><i className="text-base"><FaPlus /></i>New Category</Link>
               </div>
          </div>
     )
}