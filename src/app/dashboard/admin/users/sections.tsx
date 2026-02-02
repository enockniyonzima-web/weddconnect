
import { FaPlus } from "react-icons/fa6";
import { AdminForm } from "./[components]/AdminForm";

export const HeroSection = () => {

     return (
          <div className="w-full flex flex-col items-center justify-start gap-4 p-2 lg:p-4">
               <h1 className="text-[1.6rem] text-black font-bold w-full text-start leading-3">Platform Users</h1>
               <div className="w-full flex items-end justify-between flex-wrap gap-2">
                    <p className="text-[0.9rem] text-gray-600">Manage platform users and their permissions</p>
                    <div className="w-auto gap-[10px] flex items-center ">
                         {/* <PermissionForm icon={<i className="text-[18px]"><FaPlus /></i>} name="Add Permission" className="bg-blue-600 text-[0.8rem] rounded-[5px] whitespace-nowrap hover:bg-blue-800 py-[5px] px-[20px] text-white flex items-center gap-[5px]"  />
                         <RoleForm icon={<i className="text-[18px]"><FaPlus /></i>} name="Add Role" className="bg-blue-600 text-[0.8rem] rounded-[5px] whitespace-nowrap hover:bg-blue-800 py-[5px] px-[20px] text-white flex items-center gap-[5px]"  /> */}
                         <AdminForm icon={<i className="text-[18px]"><FaPlus /></i>} name="Add a User" className="bg-blue-600 text-base rounded-lg whitespace-nowrap hover:bg-blue-800 py-2 px-4 text-white flex items-center gap-2" />
                    </div>
               </div>
          </div>
     )
}
