"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

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