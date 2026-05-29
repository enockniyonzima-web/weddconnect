"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createBlogComment (data: Prisma.BlogCommentCreateInput) {
     try {     
          const res = await prisma.blogComment.create({data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogComment: ", error);
          return null
     }

}

export async function updateBlogComment (id:string,data: Prisma.BlogCommentUpdateInput) {
     try {
          const res = await prisma.blogComment.update({where: {id},data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogComment : ", error);
          return null
     }

}

export async function deleteBlogComment (id:string) {
     try {
          const res = await prisma.blogComment.delete({where: {id}});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogComment: ", error);
          return null
     }

}
export const fetchBlogComments = cache(async <T extends Prisma.BlogCommentSelect>(
          selectType: T, search?: Prisma.BlogCommentWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogCommentOrderByWithRelationInput | Prisma.BlogCommentOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<Prisma.BlogCommentGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.blogComment.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching BlogComments: ", error);
          return [];
     }
});

export const fetchBlogCommentById = cache(async <T extends Prisma.BlogCommentSelect>(id:string, selectType: T): Promise<Prisma.BlogCommentGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.blogComment.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching BlogComment data for id: ${id}`, error);
          return null;
     }
})

export const countBlogComments = cache(async (search?: Prisma.BlogCommentWhereInput): Promise<number> => {
     try {
          const res = await prisma.blogComment.count({where: search});
          return res;
     } catch (error) {
          console.log("Error counting BlogComments: ", error);
          return 0;
     }
});