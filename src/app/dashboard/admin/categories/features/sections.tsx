import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-3 py-3">
               <h1 className="text-2xl text-black font-bold w-full text-start leading-3">Category Features</h1>
               <div className="w-full flex items-end justify-between flex-wrap gap-2">
                    <p className="text-base text-gray-600">Manage category features</p>
                    <Link className="bg-blue-600 text-base font-medium rounded-lg whitespace-nowrap hover:bg-blue-800 py-2 px-4 text-white flex items-center gap-[5px]" prefetch={true} href={'?form=add'} ><i className="text-[18px]"><FaPlus /></i>Add new Feature</Link>
               </div>
          </div>
     )
}

