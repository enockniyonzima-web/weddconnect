"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createCategoryFeature (data: Prisma.CategoryFeatureCreateInput) {
     try {     
          const res = await prisma.categoryFeature.create({data});
          if(res) RevalidatePages.categoryFeature();
          return res;
     } catch (error) {
          console.log("Error creating category feature: ", error);
          return null
     }

}

export async function updateCategoryFeature (id:number,data: Prisma.CategoryFeatureUpdateInput) {
     try {     
          const res = await prisma.categoryFeature.update({where: {id},data});
          if(res) RevalidatePages.categoryFeature();
          return res;
     } catch (error) {
          console.log("Error updating category feature: ", error);
          return null
     }

}

export async function deleteCategoryFeature (id:number) {
     try {     
          const res = await prisma.categoryFeature.delete({where: {id}});
          if(res) RevalidatePages.categoryFeature();
          return res;
     } catch (error) {
          console.log("Error deleting category feature: ", error);
          return null
     }

}

export const fetchCategoryFeatures = cache(async <T extends Prisma.CategoryFeatureSelect>(
          selectType: T, search?: Prisma.CategoryFeatureWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.CategoryFeatureOrderByWithRelationInput | Prisma.CategoryFeatureOrderByWithRelationInput[]  = { rank: 'asc' }
     ):Promise<Prisma.CategoryFeatureGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.categoryFeature.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching Category Features: ", error);
          return [];
     }
});

export const fetchFeatureById = cache(async(id:number) => {
     try {
          const res = await prisma.categoryFeature.findUnique({where: {id}});
          return res;
     } catch (error) {
          console.log(`Error fetching feature with id: ${id}`, error);
     }
} );

export const countCategoryFeatures = cache(async (search?: Prisma.CategoryFeatureWhereInput): Promise<number> => {
     try {
          const res = await prisma.categoryFeature.count({where: search});
          return res;
     } catch (error) {
          console.log("Error counting Category Features: ", error);
          return 0;
     }
});