"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createBlogCategory (data: Prisma.BlogCategoryCreateInput) {
     try {     
          const res = await prisma.blogCategory.create({data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogCategory: ", error);
          return null
     }

}

export async function updateBlogCategory (id:string,data: Prisma.BlogCategoryUpdateInput) {
     try {
          const res = await prisma.blogCategory.update({where: {id},data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogCategory : ", error);
          return null
     }

}

export async function deleteBlogCategory (id:string) {
     try {
          const res = await prisma.blogCategory.delete({where: {id}});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogCategory: ", error);
          return null
     }

}
export const fetchBlogCategorys = cache(async <T extends Prisma.BlogCategorySelect>(
          selectType: T, search?: Prisma.BlogCategoryWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogCategoryOrderByWithRelationInput | Prisma.BlogCategoryOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<Prisma.BlogCategoryGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.blogCategory.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching BlogCategorys: ", error);
          return [];
     }
});

export const fetchBlogCategoryById = cache(async <T extends Prisma.BlogCategorySelect>(id:string, selectType: T): Promise<Prisma.BlogCategoryGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.blogCategory.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching BlogCategory data for id: ${id}`, error);
          return null;
     }
})

export const countBlogCategorys = cache(async (search?: Prisma.BlogCategoryWhereInput): Promise<number> => {
     try {
          const res = await prisma.blogCategory.count({where: search});
          return res;
     } catch (error) {
          console.log("Error counting BlogCategorys: ", error);
          return 0;
     }
});