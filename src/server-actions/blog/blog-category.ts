"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin, scopePublicQuery } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createBlogCategory (data: Prisma.BlogCategoryCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.blogCategory.create({data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating BlogCategory: ", error);
          return null
     }

}

export async function updateBlogCategory (id:string,data: Prisma.BlogCategoryUpdateInput) {
     try {
          await requireAdmin();
          const res = await prisma.blogCategory.update({where: {id},data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating BlogCategory : ", error);
          return null
     }

}

export async function deleteBlogCategory (id:string) {
     try {
          await requireAdmin();
          const res = await prisma.blogCategory.delete({where: {id}});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating BlogCategory: ", error);
          return null
     }

}
export const fetchBlogCategorys = cache(async <T extends Prisma.BlogCategorySelect>(
          selectType: T, search?: Prisma.BlogCategoryWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogCategoryOrderByWithRelationInput | Prisma.BlogCategoryOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<Prisma.BlogCategoryGetPayload<{select: T}>[]> => {
     try {
          const q = await scopePublicQuery({ select: selectType, where: search, orderBy, take });
          const res = await prisma.blogCategory.findMany({ where: q.where, take: q.take, skip, select: q.select, orderBy: q.orderBy });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error fetching BlogCategorys: ", error);
          return [];
     }
});

export const fetchBlogCategoryById = cache(async <T extends Prisma.BlogCategorySelect>(id:string, selectType: T): Promise<Prisma.BlogCategoryGetPayload<{select:T}> | null> => {
     try {
          const q = await scopePublicQuery({ select: selectType });
          const res = await prisma.blogCategory.findUnique({ where: { id }, select: q.select });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching BlogCategory data for id: ${id}`, error);
          return null;
     }
})

export const countBlogCategorys = cache(async (search?: Prisma.BlogCategoryWhereInput): Promise<number> => {
     try {
          const q = await scopePublicQuery({ select: {}, where: search });
          const res = await prisma.blogCategory.count({ where: q.where });
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error counting Blog Categories: ", error);
          return 0;
     }
});