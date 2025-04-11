
import { Prisma } from "@prisma/client"
import { PermissionsTable } from "./PermissionsTable";
import { fetchPermissions } from "@/server-actions/permission.actions";

export const PermissionSelect = {
     name: true, id:true, description:true
} satisfies Prisma.PermissionSelect;

export type TPermissionSelect = Prisma.PermissionGetPayload<{select: typeof PermissionSelect}>

export async function PermissionsContainer () {
     let Permissions: TPermissionSelect[] =[];
     const PermissionsRes = await fetchPermissions(PermissionSelect);
     Permissions = PermissionsRes.data;

     return (
          <div className="w-full overflow-x-auto flex flex-col items-center justify-start gap-[20px]">
               <h2 className="text-[1.2rem] font-bold text-gray-800 w-full text-left">Permissions</h2>
               <PermissionsTable Permissions={Permissions} />
          </div>
     )
}