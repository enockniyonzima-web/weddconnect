"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin, scopePublicQuery } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createBlogTag (data: Prisma.BlogTagCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.blogTag.create({data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating BlogTag: ", error);
          return null
     }

}

export async function updateBlogTag (id:string,data: Prisma.BlogTagUpdateInput) {
     try {
          await requireAdmin();
          const res = await prisma.blogTag.update({where: {id},data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating BlogTag : ", error);
          return null
     }

}

export async function deleteBlogTag (id:string) {
     try {
          await requireAdmin();
          const res = await prisma.blogTag.delete({where: {id}});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating BlogTag: ", error);
          return null
     }

}
export const fetchBlogTags = cache(async <T extends Prisma.BlogTagSelect>(
          selectType: T, search?: Prisma.BlogTagWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogTagOrderByWithRelationInput | Prisma.BlogTagOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<Prisma.BlogTagGetPayload<{select: T}>[]> => {
     try {
          const q = await scopePublicQuery({ select: selectType, where: search, orderBy, take });
          const res = await prisma.blogTag.findMany({ where: q.where, take: q.take, skip, select: q.select, orderBy: q.orderBy });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error fetching BlogTags: ", error);
          return [];
     }
});

export const fetchBlogTagById = cache(async <T extends Prisma.BlogTagSelect>(id:string, selectType: T): Promise<Prisma.BlogTagGetPayload<{select:T}> | null> => {
     try {
          const q = await scopePublicQuery({ select: selectType });
          const res = await prisma.blogTag.findUnique({ where: { id }, select: q.select });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching BlogTag data for id: ${id}`, error);
          return null;
     }
})

export const countBlogTags = cache(async (search?: Prisma.BlogTagWhereInput): Promise<number> => {
     try {
          const q = await scopePublicQuery({ select: {}, where: search });
          const res = await prisma.blogTag.count({ where: q.where });
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error counting BlogTags: ", error);
          return 0;
     }
});