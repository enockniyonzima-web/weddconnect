"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

export async function createService (data: Prisma.ServiceCreateInput) {
     try {     
          const res = await prisma.service.create({data});
          if(res) RevalidatePages.service();
          return res;
     } catch (error) {
          console.log("Error creating Service: ", error);
          return null
     }

}

export async function updateService (id:number,data: Prisma.ServiceUpdateInput) {
     try {     
          const res = await prisma.service.update({where: {id},data});
          if(res) RevalidatePages.service();
          return res;
     } catch (error) {
          console.log("Error creating Service : ", error);
          return null
     }

}

export async function deleteService (id:number) {
     try {     
          const res = await prisma.service.delete({where: {id}});
          if(res) RevalidatePages.service();
          return res;
     } catch (error) {
          console.log("Error creating Service: ", error);
          return null
     }

}