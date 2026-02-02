import { fetchAdmins } from "@/server-actions/admin.actions";
import { Prisma } from "@prisma/client"
// import { AdminsTable } from "./UsersTable";
import Image from "@/components/ui/Image";
import { AdminForm } from "./AdminForm";
import { Edit2 } from "lucide-react";

export const AdminSelect = {
     name: true, id:true, 
    type:true,
     user: {select: {email:true, image:true, status:true,}}
} satisfies Prisma.AdminSelect;

export type TAdminSelect = Prisma.AdminGetPayload<{select: typeof AdminSelect}>

export async function UsersContainer () {
     let admins: TAdminSelect[] =[];
     const adminRes = await fetchAdmins(AdminSelect);
     admins = adminRes.data;

     if(admins.length === 0) return (
          <div className="w-full flex items-center justify-center">
               <p className="text-lg font-medium text-gray-600">No admin users found!</p>
          </div>
     )
     return (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {admins.map(admin => <AdminCard admin={admin} key={admin.id} />)}
          </div>
     )
}

const AdminCard = ({admin}:{admin: TAdminSelect}) => {
     return (
          <div className="w-full flex flex-col items-start gap-4 rounded-xl shadow-lg bg-white border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
               {/* Header with gradient background */}
               <div className="w-full bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <div className="relative">
                                   {admin.user.image ? (
                                        <Image 
                                             src={admin.user.image} 
                                             alt={admin.name}
                                             className="w-14 h-14 rounded-full border-3 border-white shadow-md object-cover"
                                        />
                                   ) : (
                                        <div className="w-14 h-14 rounded-full border-3 border-white shadow-md bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                             <span className="text-xl font-semibold text-gray-600">
                                                  {admin.name.charAt(0).toUpperCase()}
                                             </span>
                                        </div>
                                   )}
                                   {/* Status indicator */}
                                   <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                        admin.user.status ? 'bg-green-500' : 'bg-gray-400'
                                   }`} />
                              </div>
                              
                              {/* Name and Role Badge */}
                              <div className="flex flex-col gap-1">
                                   <h3 className="text-white font-semibold text-lg leading-tight">
                                        {admin.name}
                                   </h3>
                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/30 text-white backdrop-blur-sm w-fit">
                                        {admin.type}
                                   </span>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Content Section */}
               <div className="w-full px-6 pb-5 flex flex-col gap-3">
                    {/* Email */}
                    <div className="flex items-center gap-2 text-gray-600">
                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                         </svg>
                         <span className="text-sm truncate">{admin.user.email}</span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         <span className={`text-sm font-medium ${
                              admin.user.status ? 'text-green-600' : 'text-gray-500'
                         }`}>
                              {admin.user.status ? "ACTIVE" : "INACTIVE"}
                         </span>
                    </div>
                    <div className="w-full flex items-center">
                         <AdminForm className="py-2 px-4 bg-gradient-to-t from-gray-100 to-gray-200 text-gray-800 rounded-lg w-full flex items-center justify-center font-bold gap-2" name="Edit" id={admin.id} icon={<Edit2 className="w-4 h-4" />} />
                    </div>
               </div>
          </div>
     )
}