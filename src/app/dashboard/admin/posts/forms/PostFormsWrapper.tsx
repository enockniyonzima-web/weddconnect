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
          <div className="w-screen h-screen bg-black/60 backdrop-blur-sm fixed top-0 left-0 flex items-center justify-center overflow-hidden z-30">
               <div className="w-full md:w-[70%] mx-[2%] lg:w-[50%] flex flex-col items-center justify-start gap-5 rounded-xl bg-gray-900 border border-gray-800 p-4 max-h-[80vh] overflow-y-auto">
                    <div className="w-full flex items-center justify-between bg-gray-800/50 py-2 px-4 rounded-lg">
                         <h1 className="text-gray-100 text-xl font-bold">{title}</h1>
                         <Link href="/dashboard/admin/posts" className="flex items-center w-auto aspect-square rounded-full border border-red-500/50 hover:bg-red-500/10 p-1.5 transition-colors">
                              <i className="text-xl text-red-500"><IoClose /></i>
                         </Link>
                    </div>
                    <AddPostForm contactTypes={contactTypes} post={searchPost} categories={categories} vendors={vendors} /> 
               </div>
               
          </div>
     )
}