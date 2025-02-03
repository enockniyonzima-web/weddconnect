"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

export async function createPermission (data: Prisma.PermissionCreateInput) {
     try {     
          const res = await prisma.permission.create({data});
          if(res) RevalidatePages.permission();
          return res;
     } catch (error) {
          console.log("Error creating Permission: ", error);
          return null
     }

}

export async function updatePermission (id:number,data: Prisma.PermissionUpdateInput) {
     try {     
          const res = await prisma.permission.update({where: {id},data});
          if(res) RevalidatePages.permission();
          return res;
     } catch (error) {
          console.log("Error creating Permission : ", error);
          return null
     }

}

export async function deletePermission (id:number) {
     try {     
          const res = await prisma.permission.delete({where: {id}});
          if(res) RevalidatePages.permission();
          return res;
     } catch (error) {
          console.log("Error creating Permission: ", error);
          return null
     }

}