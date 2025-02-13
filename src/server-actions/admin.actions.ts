"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

export async function createAdmin (data: Prisma.AdminCreateInput) {
     try {     
          const res = await prisma.admin.create({data});
          if(res) RevalidatePages.admin();
          return res;
     } catch (error) {
          console.log("Error creating Admin: ", error);
          return null
     }

}

export async function updateAdmin (id:number,data: Prisma.AdminUpdateInput) {
     try {     
          const res = await prisma.admin.update({where: {id},data});
          if(res) RevalidatePages.admin();
          return res;
     } catch (error) {
          console.log("Error creating Admin : ", error);
          return null
     }

}

export async function deleteAdmin (id:number) {
     try {     
          const res = await prisma.admin.delete({where: {id}});
          if(res) RevalidatePages.admin();
          return res;
     } catch (error) {
          console.log("Error creating Admin: ", error);
          return null
     }

}