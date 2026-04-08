import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-[10px]">
               <h1 className="text-xl text-white font-bold w-full text-start">Posts</h1>
               <div className="w-full flex items-end flex-wrap gap-2 justify-between">
                    <p className="text-sm text-gray-400">Manage your vendors, and posts</p>
                    <Link className="bg-blue-600 text-sm font-medium rounded-lg whitespace-nowrap hover:bg-blue-500 py-2 px-4 text-white flex items-center gap-2 transition-colors" prefetch={true} href={'/dashboard/admin/posts?form=add'} ><i className="text-base"><FaPlus /></i>Add Post</Link>
               </div>
          </div>
     )
}