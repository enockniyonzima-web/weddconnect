import { TCategory, TPost, TVendor } from "@/common/Entities";
import Endpoints from "@/services/Endpoints";
import { MainServer } from "@/services/Server";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import AddPostForm from "./AddPostForm";
import { ContactType } from "@prisma/client";

export default async function PostFormsWrapper ({search}:{search: Record<string, string | undefined>}) {
     const formType = search.form;
     let searchPost:TPost | null = null;
     let vendors: TVendor[] = [];
     let categories: TCategory[] = [];
     let contactTypes: ContactType[] = [];

     const vendorRes = await MainServer.fetch(`${Endpoints.vendors}`);
     const categoryRes = await MainServer.fetch(`${Endpoints.category.default}`);
     if(vendorRes) vendors = vendorRes.data;
     if(categoryRes) categories = categoryRes.data;
     
     if(!formType) return null;

     if(search.id) {
          const id = Number(search.id || 0);
          if (id !== 0) {
               const postRes = await MainServer.fetch(`${Endpoints.posts}/${id}`);
               if(postRes) searchPost = postRes.data;
          }
          const contactTypesRes  = await MainServer.fetch(`${Endpoints.contactType}`);
          if(contactTypesRes) {
               contactTypes = contactTypesRes.data
          }
     }

     
     const title = searchPost === null ? 'Add Post' : 'Edit Post';


     return (
          <div className="w-screen h-screen bg-black/50 fixed top-0 left-0 flex items-center justify-center overflow-hidden z-30">
               <div className="w-full md:w-[70%] mx-[2%] lg:w-[50%] flex flex-col items-center justify-start gap-[20px] rounded-[10px] bg-white p-[10px] max-h-[80vh] overflow-y-auto">
                    <div className="w-full flex items-center justify-between bg-gray-100 py-[5px] px-[10px] rounded-[10px]">
                         <h1 className="text-gray-600 text-[1.4rem] font-bold">{title}</h1>
                         <Link href="/dashboard/admin/posts" className="flex items-center w-auto aspect-square rounded-full border-[1.3px] border-red-600 hover:bg-red-100 p-[5px]">
                              <i className="text-[24px] text-red-600 "><IoClose /></i>
                         </Link>
                    </div>
                    <AddPostForm contactTypes={contactTypes} post={searchPost} categories={categories} vendors={vendors} /> 
               </div>
               
          </div>
     )
}