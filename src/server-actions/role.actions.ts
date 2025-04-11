"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

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


export const fetchRoles = cache(async<T extends Prisma.RoleSelect>(selectType: T):Promise<{data: Prisma.RoleGetPayload<{select:T}>[], pagination:{total:number}}> => {
     try{
          const res= await prisma.role.findMany({select: selectType});
          const total =await prisma.role.count();
          return {data:res, pagination: {total}}
     }catch(error){
          console.log(`Error fetching Roles: `, error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchRoleById = cache(async<T extends Prisma.RoleSelect>(id:number, selectType:T):Promise<Prisma.RoleGetPayload<{select: T}> | null> => {
     try {
          const res = await prisma.role.findUnique({where:{id}, select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Role data for id: ${id}`,error);
          return null;
     }
});