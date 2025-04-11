import { fetchRoles } from "@/server-actions/role.actions";
import { Prisma } from "@prisma/client"
import { RolesTable } from "./RolesTable";

export const RoleSelect = {
     name: true, id:true, 
     permissions:{select:{name:true,id:true}}
} satisfies Prisma.RoleSelect;

export type TRoleSelect = Prisma.RoleGetPayload<{select: typeof RoleSelect}>

export async function RolesContainer () {
     let roles: TRoleSelect[] =[];
     const rolesRes = await fetchRoles(RoleSelect);
     roles = rolesRes.data;

     return (
          <div className="w-full overflow-x-auto flex flex-col items-center justify-start gap-[20px]">
               <h2 className="text-[1.2rem] font-bold text-gray-800 w-full text-left">Roles</h2>
               <RolesTable roles={roles} />
          </div>
     )
}