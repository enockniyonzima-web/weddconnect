import Link from "next/link";
import { IoClose } from "react-icons/io5";
import AddFeatureForm from "./AddFeatureForm";
import { CategoryFeature } from "@prisma/client";
import { fetchFeatureById } from "@/server-actions/category-feature.actions";

export default async function FeaturesFormsWrapper ({search}:{search:Record<string, string | undefined>}){
     const formType = search.form;
     let updateFeature:CategoryFeature | null | undefined = null;
     const id  = search.id;
     if(!formType) return null;
     if(id) {
          updateFeature = await fetchFeatureById(Number(id)); 
     }

     

     const title = !id ? 'New Category Feature' : 'Edit Feature';
     return (
          <div className="w-screen h-screen bg-black/60 backdrop-blur-sm fixed top-0 left-0 flex items-center justify-center overflow-hidden z-30">
               <div className="w-full md:w-[70%] mx-[2%] lg:w-[50%] flex flex-col items-center justify-start gap-5 rounded-xl bg-gray-900 border border-gray-800 p-4 max-h-[80vh] overflow-y-auto">
                    <div className="w-full flex items-center justify-between bg-gray-800/50 py-2 px-4 rounded-lg">
                         <h1 className="text-gray-100 text-xl font-bold">{title}</h1>
                         <Link href="/dashboard/admin/categories/features" className="flex items-center w-auto aspect-square rounded-full border border-red-500/50 hover:bg-red-500/10 p-1.5 transition-colors">
                              <i className="text-xl text-red-500"><IoClose /></i>
                         </Link>
                    </div>
                    <AddFeatureForm updateFeature={updateFeature} />
               </div>
               
          </div>
     )
}