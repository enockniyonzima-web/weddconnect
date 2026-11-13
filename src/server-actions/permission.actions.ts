"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createPermission (data: Prisma.PermissionCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.permission.create({data});
          if(res) RevalidatePages.permission();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Permission: ", error);
          return null
     }

}

export async function updatePermission (id:number,data: Prisma.PermissionUpdateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.permission.update({where: {id},data});
          if(res) RevalidatePages.permission();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Permission : ", error);
          return null
     }

}

export async function deletePermission (id:number) {
     try {     
          await requireAdmin();
          const res = await prisma.permission.delete({where: {id}});
          if(res) RevalidatePages.permission();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Permission: ", error);
          return null
     }

}


export const fetchPermissions = cache(async<T extends Prisma.PermissionSelect>(selectType: T):Promise<{data: Prisma.PermissionGetPayload<{select:T}>[], pagination:{total:number}}> => {
     try{
          await requireAdmin();
          const res= await prisma.permission.findMany({select: selectType});
          const total =await prisma.permission.count();
          return {data:res, pagination: {total}}
     }catch(error){
          unstable_rethrow(error);
          console.log(`Error fetching Permissions: `, error);
          return {data:[], pagination:{total:0}}
     }
})

export const fetchPermissionById = cache(async<T extends Prisma.PermissionSelect>(id:number, selectType:T):Promise<Prisma.PermissionGetPayload<{select: T}> | null> => {
     try {
          await requireAdmin();
          const res = await prisma.permission.findUnique({where:{id}, select: selectType});
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching Permission data for id: ${id}`,error);
          return null;
     }
})