"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

export async function createService (data: Prisma.ServiceCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.service.create({data});
          if(res) RevalidatePages.service();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Service: ", error);
          return null
     }

}

export async function updateService (id:number,data: Prisma.ServiceUpdateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.service.update({where: {id},data});
          if(res) RevalidatePages.service();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Service : ", error);
          return null
     }

}

export async function deleteService (id:number) {
     try {     
          await requireAdmin();
          const res = await prisma.service.delete({where: {id}});
          if(res) RevalidatePages.service();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Service: ", error);
          return null
     }

}