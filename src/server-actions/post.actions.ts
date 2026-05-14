
"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createPost (data: Prisma.PostCreateInput) {
     try {     
          const res = await prisma.post.create({data});
          if(res) RevalidatePages.post();
          return res;
     } catch (error) {
          console.log("Error creating Post: ", error);
          return null
     }

}

export async function updatePost (id:number,data: Prisma.PostUpdateInput) {
     try {     
          const res = await prisma.post.update({where: {id},data});
          if(res) RevalidatePages.post();
          return res;
     } catch (error) {
          console.log("Error updating Post : ", error);
          return null
     }

}

export async function deletePost (id:number) {
     try {     
          const res = await prisma.post.delete({where: {id}});
          if(res) RevalidatePages.post();
          return res;
     } catch (error) {
          console.log("Error creating Post: ", error);
          return null
     }

}

export async function deletePostFeatures (postId: number) {
     return await prisma.postFeature.deleteMany({where: {postId}});
}

export const fetchPosts = cache(async <T extends Prisma.PostSelect>(
          selectType: T, search?: Prisma.PostWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<Prisma.PostGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.post.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching Posts: ", error);
          return [];
     }
});

export const fetchPostById = cache(async <T extends Prisma.PostSelect>(id:number, selectType: T): Promise<Prisma.PostGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.post.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Post data for id: ${id}`, error);
          return null;
     }
})

export const countPosts = cache(async (search?: Prisma.PostWhereInput): Promise<number> => {
     try {
          const count = await prisma.post.count({where: search});
          return count;
     } catch (error) {
          console.log("Error counting Posts: ", error);
          return 0;
     }
})