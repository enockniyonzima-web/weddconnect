"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createBlogView (data: Prisma.BlogViewCreateInput) {
     try {     
          const res = await prisma.blogView.create({data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogView: ", error);
          return null
     }

}

export async function updateBlogView (id:string,data: Prisma.BlogViewUpdateInput) {
     try {
          const res = await prisma.blogView.update({where: {id},data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogView : ", error);
          return null
     }

}

export async function deleteBlogView (id:string) {
     try {
          const res = await prisma.blogView.delete({where: {id}});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogView: ", error);
          return null
     }

}
export const fetchBlogViews = cache(async <T extends Prisma.BlogViewSelect>(
          selectType: T, search?: Prisma.BlogViewWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogViewOrderByWithRelationInput | Prisma.BlogViewOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<Prisma.BlogViewGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.blogView.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching BlogViews: ", error);
          return [];
     }
});

export const fetchBlogViewById = cache(async <T extends Prisma.BlogViewSelect>(id:string, selectType: T): Promise<Prisma.BlogViewGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.blogView.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching BlogView data for id: ${id}`, error);
          return null;
     }
})

export const countBlogViews = cache(async (search?: Prisma.BlogViewWhereInput): Promise<number> => {
     try {
          const res = await prisma.blogView.count({where: search});
          return res;
     } catch (error) {
          console.log("Error counting BlogViews: ", error);
          return 0;
     }
});