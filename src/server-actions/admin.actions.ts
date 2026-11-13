"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createAdmin (data: Prisma.AdminCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.admin.create({data});
          if(res) RevalidatePages.admin();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Admin: ", error);
          return null
     }

}

export async function updateAdmin (id:number,data: Prisma.AdminUpdateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.admin.update({where: {id},data});
          if(res) RevalidatePages.admin();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Admin : ", error);
          return null
     }

}

export async function deleteAdmin (id:number) {
     try {     
          await requireAdmin();
          const res = await prisma.admin.delete({where: {id}});
          if(res) RevalidatePages.admin();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Admin: ", error);
          return null
     }

}

export const fetchAdmins = cache(async<T extends Prisma.AdminSelect>(selectType: T):Promise<{data: Prisma.AdminGetPayload<{select:T}>[], pagination:{total:number}}> => {
     try{
          await requireAdmin();
          const res= await prisma.admin.findMany({select: selectType});
          const total =await prisma.admin.count();
          return {data:res, pagination: {total}}
     }catch(error){
          unstable_rethrow(error);
          console.log(`Error fetching admins: `, error);
          return {data:[], pagination:{total:0}}
     }
})

export const fetchAdminById = cache(async<T extends Prisma.AdminSelect>(id:number, selectType:T):Promise<Prisma.AdminGetPayload<{select: T}> | null> => {
     try {
          await requireAdmin();
          const res = await prisma.admin.findUnique({where:{id}, select: selectType});
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching admin data for id: ${id}`,error);
          return null;
     }
})