"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

export async function createClient (data: Prisma.ClientCreateInput) {
     try {     
          const res = await prisma.client.create({data});
          if(res) RevalidatePages.client();
          return res;
     } catch (error) {
          console.log("Error creating Client: ", error);
          return null
     }

}

export async function updateClient (id:number,data: Prisma.ClientUpdateInput) {
     try {     
          const res = await prisma.client.update({where: {id},data});
          if(res) RevalidatePages.client();
          return res;
     } catch (error) {
          console.log("Error creating Client : ", error);
          return null
     }

}

export async function deleteClient (id:number) {
     try {     
          const res = await prisma.client.delete({where: {id}});
          if(res) RevalidatePages.client();
          return res;
     } catch (error) {
          console.log("Error creating Client: ", error);
          return null
     }

}