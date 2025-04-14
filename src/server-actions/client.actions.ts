/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createClient (data: Prisma.ClientCreateInput) {
     try {     
          const res = await prisma.client.create({data});
          if(res) RevalidatePages.client();
          return res;
     } catch (error) {
          return null
     }

}

export async function updateClient (id:number,data: Prisma.ClientUpdateInput) {
     try {     
          const res = await prisma.client.update({where: {id},data});
          if(res) RevalidatePages.client();
          return res;
     } catch (error) {
          return null
     }

}

export async function deleteClient (id:number) {
     try {     
          const res = await prisma.client.delete({where: {id}});
          if(res) RevalidatePages.client();
          return res;
     } catch (error) {
          return null
     }

}


export const fetchClients = cache(async<T extends Prisma.ClientSelect>(selectType: T, filters?:Prisma.ClientWhereInput):Promise<{data: Prisma.ClientGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try{
          const clientRes = await prisma.client.findMany({select: selectType, where:filters});
          const total = await prisma.client.count({where: filters});
          return {data:clientRes, pagination:{total}};
     }catch(error){
          console.log("Error fetching clients: ", error);
          return {data: [], pagination:{total:0}};
     }
} );

export const fetchClientById = cache(async<T extends Prisma.ClientSelect>(id:number,selectType: T):Promise<Prisma.ClientGetPayload<{select: T}> | null> => {
     try{
          const clientRes = await prisma.client.findUnique({where: {id},select: selectType});
          return clientRes;
     }catch(error){
          console.log("Error fetching client: ", error);
          return null;
     }
} );