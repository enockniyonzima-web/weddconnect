import Link from "next/link";
import { IoClose } from "react-icons/io5";
import AddCategoryForm from "./AddCategoryForm";
import { TCategory } from "@/common/Entities";
import { CategoryFeature } from "@prisma/client";
import { MainServer } from "@/services/Server";
import Endpoints from "@/services/Endpoints";
import UpdateCategoryForm from "./UpdateCategoryForm";


export default async function CategoryFormWrapper ({search}:{search: Record<string, string | undefined>}){
     const formType = search.form;
     let searchCategoy: TCategory | null = null;
     let categoryFeatures: CategoryFeature[]  = [];

     if(!formType) return null;

     const title = formType === 'add' ? 'Add Category' : 'Edit Category';
     if(formType === "update") {
          const categoryId = search.id ? +search.id : 0;
          const  categoryRes = await MainServer.fetch(`${Endpoints.category.default}/${categoryId}`);
          const featureRes = await MainServer.fetch(`${Endpoints.category.categoryFeature}`);

          if(categoryRes && categoryRes.data) {
               searchCategoy = categoryRes.data;
          }
          if(featureRes) {
               categoryFeatures = featureRes.data;
          }
     }

     return (
          <div className="w-screen h-screen bg-black/50 fixed top-0 left-0 flex items-center justify-center overflow-hidden z-30">
               <div className="w-full md:w-[70%] mx-[2%] lg:w-[50%] flex flex-col items-center justify-start gap-[20px] rounded-[10px] bg-white p-[10px] max-h-[80vh] overflow-y-auto">
                    <div className="w-full flex items-center justify-between py-[5px] px-[10px] rounded-[10px]">
                         <h1 className="text-gray-600 text-[1.4rem] font-bold">{title}</h1>
                         <Link href="/dashboard/admin/categories" className="flex items-center w-auto aspect-square rounded-full border-[1.3px] border-red-600 hover:bg-red-100 p-[5px]">
                              <i className="text-[24px] text-red-600 "><IoClose /></i>
                         </Link>
                    </div>
                    {
                         formType === "add" ? <AddCategoryForm /> : 
                         formType === "update" && searchCategoy ? <UpdateCategoryForm category={searchCategoy} features={categoryFeatures} /> : null
                    }
               </div>
               
          </div>
     )
}