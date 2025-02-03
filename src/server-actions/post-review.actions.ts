"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

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