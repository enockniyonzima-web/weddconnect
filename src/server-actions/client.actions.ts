"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin, requireClientAccess } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createClient (data: Prisma.ClientCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.client.create({data});
          if(res) RevalidatePages.client();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          return null
     }

}

// Admins can update any client. A client can only update their own name and phone.
export async function updateClient (id:number,data: Prisma.ClientUpdateInput) {
     try {
          const caller = await requireClientAccess(id);
          if (!caller.admin) {
               data = {
                    ...(typeof data.name === "string" ? { name: data.name } : {}),
                    ...(typeof data.phone === "string" ? { phone: data.phone } : {}),
               };
          }
          const res = await prisma.client.update({where: {id},data, select: {id:true, name:true, phone:true}});
          if(res) RevalidatePages.client();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          return null
     }

}

export async function deleteClient (id:number) {
     try {  
          await requireAdmin();
          const exClient = await prisma.client.findUnique({where: {id}, include:{user:true}});
          if(!exClient) return null;   
          const res = await prisma.user.delete({where: {id: exClient.user.id}});
          if(res) RevalidatePages.client();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          return null
     }

}


export const fetchClients = cache(async<T extends Prisma.ClientSelect>(selectType: T, filters?:Prisma.ClientWhereInput):Promise<{data: Prisma.ClientGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try{
          await requireAdmin();
          const clientRes = await prisma.client.findMany({select: selectType, where:filters});
          const total = await prisma.client.count({where: filters});
          return {data:clientRes, pagination:{total}};
     }catch(error){
          unstable_rethrow(error);
          console.log("Error fetching clients: ", error);
          return {data: [], pagination:{total:0}};
     }
} );

export const fetchClientById = cache(async<T extends Prisma.ClientSelect>(id:number,selectType: T):Promise<Prisma.ClientGetPayload<{select: T}> | null> => {
     try{
          await requireClientAccess(id);
          const clientRes = await prisma.client.findUnique({where: {id},select: selectType});
          return clientRes;
     }catch(error){
          unstable_rethrow(error);
          console.log("Error fetching client: ", error);
          return null;
     }
} );