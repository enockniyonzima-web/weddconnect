"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

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