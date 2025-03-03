import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-[10px]">
               <h1 className="text-[1.6rem] text-black font-bold w-full text-start leading-3">Category Features</h1>
               <div className="w-full flex items-end justify-between">
                    <p className="text-[0.9rem] text-gray-600">Manage category features</p>
                    <Link className="bg-blue-600 text-[0.8rem] rounded-[5px] whitespace-nowrap hover:bg-blue-800 py-[5px] px-[20px] text-white flex items-center gap-[5px]" prefetch={true} href={'?form=add'} ><i className="text-[18px]"><FaPlus /></i>Add new Feature</Link>
               </div>
          </div>
     )
}

