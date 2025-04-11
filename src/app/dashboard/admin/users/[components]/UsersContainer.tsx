import { fetchAdmins } from "@/server-actions/admin.actions";
import { Prisma } from "@prisma/client"
import { AdminsTable } from "./UsersTable";

export const AdminSelect = {
     name: true, id:true, 
     role: {select:{name:true}},
     user: {select: {email:true, image:true, status:true,}}
} satisfies Prisma.AdminSelect;

export type TAdminSelect = Prisma.AdminGetPayload<{select: typeof AdminSelect}>

export async function UsersContainer () {
     let admins: TAdminSelect[] =[];
     const adminRes = await fetchAdmins(AdminSelect);
     admins = adminRes.data;

     return (
          <div className="w-full overflow-x-auto flex flex-col items-center justify-start gap-[20px]">
               <AdminsTable admins={admins} />
          </div>
     )
}