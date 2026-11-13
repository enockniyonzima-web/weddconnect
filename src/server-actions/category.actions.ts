"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin, scopePublicQuery } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createCategory (data: Prisma.CategoryCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.category.create({data});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating category: ", error);
          return null
     }

}

export async function updateCategory (id:number,data: Prisma.CategoryUpdateInput) {
     try {
          await requireAdmin();
          const res = await prisma.category.update({where: {id},data});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating category : ", error);
          return null
     }

}

export async function deleteCategory (id:number) {
     try {
          await requireAdmin();
          const res = await prisma.category.delete({where: {id}});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating category: ", error);
          return null
     }

}
export const fetchCategories = cache(async <T extends Prisma.CategorySelect>(
          selectType: T, search?: Prisma.CategoryWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[]  = { rank: 'asc' }
     ):Promise<Prisma.CategoryGetPayload<{select: T}>[]> => {
     try {
          const q = await scopePublicQuery({ select: selectType, where: search, orderBy, take });
          const res = await prisma.category.findMany({ where: q.where, take: q.take, skip, select: q.select, orderBy: q.orderBy });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error fetching Categories: ", error);
          return [];
     }
});

export const fetchCategoryById = cache(async <T extends Prisma.CategorySelect>(id:number, selectType: T): Promise<Prisma.CategoryGetPayload<{select:T}> | null> => {
     try {
          const q = await scopePublicQuery({ select: selectType });
          const res = await prisma.category.findUnique({ where: { id }, select: q.select });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching Category data for id: ${id}`, error);
          return null;
     }
})

export const countCategories = cache(async (search?: Prisma.CategoryWhereInput): Promise<number> => {
     try {
          const q = await scopePublicQuery({ select: {}, where: search });
          const res = await prisma.category.count({ where: q.where });
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error counting Categories: ", error);
          return 0;
     }
});