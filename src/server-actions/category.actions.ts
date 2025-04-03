"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { stringToBoolean } from "@/util/stringFuncs";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createCategory (data: Prisma.CategoryCreateInput) {
     try {     
          const res = await prisma.category.create({data});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          console.log("Error creating category: ", error);
          return null
     }

}

export async function updateCategory (id:number,data: Prisma.CategoryUpdateInput) {
     try {     
          const res = await prisma.category.update({where: {id},data});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          console.log("Error creating category : ", error);
          return null
     }

}

export async function deleteCategory (id:number) {
     try {     
          const res = await prisma.category.delete({where: {id}});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          console.log("Error creating category: ", error);
          return null
     }

}

export const fetchCategories = cache(async (params:URLSearchParams) => {
     try {
          const filters: Record<string, string | number | boolean> = {};
          const status = params.get("status");

          if(status) filters.status = stringToBoolean(status);
          const res = await prisma.category.findMany({
               where: {...filters}, 
                    select:{
                         id:true, name:true, status:true, icon:true, description:true,
                         features:true,
                         _count: {
                              select:{
                                   posts:true
                              }
                         }
                    },
                    orderBy: [{id: 'asc'}]
          });
          return {data:res};
     } catch (error) {
          console.log(error);
          return null;
     }
})