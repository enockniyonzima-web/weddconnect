import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { TCategory } from "@/common/Entities";
import { CategoryFeature } from "@prisma/client";
import { MainServer } from "@/services/Server";
import Endpoints from "@/services/Endpoints";
import CategoryForm from "./CategoryForm";


export default async function CategoryFormWrapper ({search}:{search: Record<string, string | undefined>}){
     const formType = search.form;
     let searchCategory: TCategory | null = null;
     let categoryFeatures: CategoryFeature[]  = [];

     if(!formType) return null;

     const title = formType === 'add' ? 'New Category' : 'Edit Category';
     if(formType === "update") {
          const categoryId = search.id ? +search.id : 0;
          const categoryRes = await MainServer.fetch(`${Endpoints.category.default}/${categoryId}`);
          const featureRes = await MainServer.fetch(`${Endpoints.category.categoryFeature}`);

          if(categoryRes && categoryRes.data) {
               searchCategory = categoryRes.data;
          }
          if(featureRes) {
               categoryFeatures = featureRes.data;
          }
     }

     return (
          <div className="w-screen h-screen bg-black/60 backdrop-blur-sm fixed top-0 left-0 flex items-center justify-center overflow-hidden z-30">
               <div className="w-full md:w-[70%] mx-[2%] lg:w-[50%] flex flex-col items-center justify-start gap-5 rounded-xl bg-gray-900 border border-gray-800 p-4 max-h-[80vh] overflow-y-auto">
                    <div className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-gray-800/50">
                         <h1 className="text-gray-100 text-xl font-bold">{title}</h1>
                         <Link href="/dashboard/admin/categories" className="flex items-center w-auto aspect-square rounded-full border border-red-500/50 hover:bg-red-500/10 p-1.5 transition-colors">
                              <i className="text-xl text-red-500"><IoClose /></i>
                         </Link>
                    </div>
                    <CategoryForm
                         category={formType === "update" ? searchCategory : undefined}
                         features={categoryFeatures}
                    />
               </div>
          </div>
     )
}