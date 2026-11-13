"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin, scopePublicQuery } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createCategoryFeature (data: Prisma.CategoryFeatureCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.categoryFeature.create({data});
          if(res) RevalidatePages.categoryFeature();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating category feature: ", error);
          return null
     }

}

export async function updateCategoryFeature (id:number,data: Prisma.CategoryFeatureUpdateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.categoryFeature.update({where: {id},data});
          if(res) RevalidatePages.categoryFeature();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error updating category feature: ", error);
          return null
     }

}

export async function deleteCategoryFeature (id:number) {
     try {     
          await requireAdmin();
          const res = await prisma.categoryFeature.delete({where: {id}});
          if(res) RevalidatePages.categoryFeature();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error deleting category feature: ", error);
          return null
     }

}

export const fetchCategoryFeatures = cache(async <T extends Prisma.CategoryFeatureSelect>(
          selectType: T, search?: Prisma.CategoryFeatureWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.CategoryFeatureOrderByWithRelationInput | Prisma.CategoryFeatureOrderByWithRelationInput[]  = { rank: 'asc' }
     ):Promise<Prisma.CategoryFeatureGetPayload<{select: T}>[]> => {
     try {
          const q = await scopePublicQuery({ select: selectType, where: search, orderBy, take });
          const res = await prisma.categoryFeature.findMany({ where: q.where, take: q.take, skip, select: q.select, orderBy: q.orderBy });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error fetching Category Features: ", error);
          return [];
     }
});

export const fetchFeatureById = cache(async(id:number) => {
     try {
          const res = await prisma.categoryFeature.findUnique({where: {id}});
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching feature with id: ${id}`, error);
     }
} );

export const countCategoryFeatures = cache(async (search?: Prisma.CategoryFeatureWhereInput): Promise<number> => {
     try {
          const q = await scopePublicQuery({ select: {}, where: search });
          const res = await prisma.categoryFeature.count({ where: q.where });
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error counting Category Features: ", error);
          return 0;
     }
});