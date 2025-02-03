"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

export async function createRole (data: Prisma.RoleCreateInput) {
     try {     
          const res = await prisma.role.create({data});
          if(res) RevalidatePages.role();
          return res;
     } catch (error) {
          console.log("Error creating Role: ", error);
          return null
     }

}

export async function updateRole (id:number,data: Prisma.RoleUpdateInput) {
     try {     
          const res = await prisma.role.update({where: {id},data});
          if(res) RevalidatePages.role();
          return res;
     } catch (error) {
          console.log("Error creating Role : ", error);
          return null
     }

}

export async function deleteRole (id:number) {
     try {     
          const res = await prisma.role.delete({where: {id}});
          if(res) RevalidatePages.role();
          return res;
     } catch (error) {
          console.log("Error creating Role: ", error);
          return null
     }

}