"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createPostReview (data: Prisma.PostReviewCreateInput) {
     try {     
          const res = await prisma.postReview.create({data});
          if(res) RevalidatePages.postReview();
          return res;
     } catch (error) {
          console.log("Error creating PostReview: ", error);
          return null
     }

}

export async function updatePostReview (id:number,data: Prisma.PostReviewUpdateInput) {
     try {     
          const res = await prisma.postReview.update({where: {id},data});
          if(res) RevalidatePages.postReview();
          return res;
     } catch (error) {
          console.log("Error creating PostReview : ", error);
          return null
     }

}

export async function deletePostReview (id:number) {
     try {     
          const res = await prisma.postReview.delete({where: {id}});
          if(res) RevalidatePages.postReview();
          return res;
     } catch (error) {
          console.log("Error creating PostReview: ", error);
          return null
     }

}

export const fetchPostReviews = cache(async <T extends Prisma.PostReviewSelect>(
          selectType: T, search?: Prisma.PostReviewWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.PostReviewOrderByWithRelationInput | Prisma.PostReviewOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<Prisma.PostReviewGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.postReview.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching PostReviews: ", error);
          return [];
     }
});

export const fetchPostReviewById = cache(async <T extends Prisma.PostReviewSelect>(id:number, selectType: T): Promise<Prisma.PostReviewGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.postReview.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching PostReview data for id: ${id}`, error);
          return null;
     }
})