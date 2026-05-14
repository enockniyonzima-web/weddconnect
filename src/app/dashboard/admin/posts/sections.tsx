import { PostFormBtn } from "@/components/forms/PostForm";

export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-[10px]">
               <h1 className="text-xl text-white font-bold w-full text-start">Posts</h1>
               <div className="w-full flex items-end flex-wrap gap-2 justify-between">
                    <p className="text-sm text-gray-400">Manage your vendors, and posts</p>
                    <PostFormBtn showBtnIcon showBtnName />
               </div>
          </div>
     )
}