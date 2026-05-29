"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createBlogTag (data: Prisma.BlogTagCreateInput) {
     try {     
          const res = await prisma.blogTag.create({data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogTag: ", error);
          return null
     }

}

export async function updateBlogTag (id:string,data: Prisma.BlogTagUpdateInput) {
     try {
          const res = await prisma.blogTag.update({where: {id},data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogTag : ", error);
          return null
     }

}

export async function deleteBlogTag (id:string) {
     try {
          const res = await prisma.blogTag.delete({where: {id}});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogTag: ", error);
          return null
     }

}
export const fetchBlogTags = cache(async <T extends Prisma.BlogTagSelect>(
          selectType: T, search?: Prisma.BlogTagWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogTagOrderByWithRelationInput | Prisma.BlogTagOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<Prisma.BlogTagGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.blogTag.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching BlogTags: ", error);
          return [];
     }
});

export const fetchBlogTagById = cache(async <T extends Prisma.BlogTagSelect>(id:string, selectType: T): Promise<Prisma.BlogTagGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.blogTag.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching BlogTag data for id: ${id}`, error);
          return null;
     }
})

export const countBlogTags = cache(async (search?: Prisma.BlogTagWhereInput): Promise<number> => {
     try {
          const res = await prisma.blogTag.count({where: search});
          return res;
     } catch (error) {
          console.log("Error counting BlogTags: ", error);
          return 0;
     }
});