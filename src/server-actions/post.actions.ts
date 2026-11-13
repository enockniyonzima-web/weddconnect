
"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin, requireSubscriberOrAdmin, scopePublicQuery } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createPost (data: Prisma.PostCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.post.create({data});
          if(res) RevalidatePages.post();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Post: ", error);
          return null
     }

}

export async function updatePost (id:number,data: Prisma.PostUpdateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.post.update({where: {id},data});
          if(res) RevalidatePages.post();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error updating Post : ", error);
          return null
     }

}

export async function deletePost (id:number) {
     try {     
          await requireAdmin();
          const res = await prisma.post.delete({where: {id}});
          if(res) RevalidatePages.post();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating Post: ", error);
          return null
     }

}

export async function deletePostFeatures (postId: number) {
     await requireAdmin();
     return await prisma.postFeature.deleteMany({where: {postId}});
}

export const fetchPosts = cache(async <T extends Prisma.PostSelect>(
          selectType: T, search?: Prisma.PostWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[]  = { sortOrder: 'asc' }
     ):Promise<Prisma.PostGetPayload<{select: T}>[]> => {
     try {
          await requireSubscriberOrAdmin();
          const q = await scopePublicQuery({ select: selectType, where: search, orderBy, take });
          const res = await prisma.post.findMany({ where: q.where, take: q.take, skip, select: q.select, orderBy: q.orderBy });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error fetching Posts: ", error);
          return [];
     }
});

export const fetchPostById = cache(async <T extends Prisma.PostSelect>(id:number, selectType: T): Promise<Prisma.PostGetPayload<{select:T}> | null> => {
     try {
          await requireSubscriberOrAdmin();
          const q = await scopePublicQuery({ select: selectType });
          const res = await prisma.post.findUnique({ where: { id }, select: q.select });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching Post data for id: ${id}`, error);
          return null;
     }
})

export const countPosts = cache(async (search?: Prisma.PostWhereInput): Promise<number> => {
     try {
          await requireSubscriberOrAdmin();
          const q = await scopePublicQuery({ select: {}, where: search });
          const count = await prisma.post.count({ where: q.where });
          return count;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error counting Posts: ", error);
          return 0;
     }
})