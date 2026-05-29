"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createBlogPost (data: Prisma.BlogPostCreateInput) {
     try {     
          const res = await prisma.blogPost.create({data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogPost: ", error);
          return null
     }

}

export async function updateBlogPost (id:string,data: Prisma.BlogPostUpdateInput) {
     try {
          const res = await prisma.blogPost.update({where: {id},data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogPost : ", error);
          return null
     }

}

export async function deleteBlogPost (id:string) {
     try {
          const res = await prisma.blogPost.delete({where: {id}});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          console.log("Error creating BlogPost: ", error);
          return null
     }

}
export const fetchBlogPosts = cache(async <T extends Prisma.BlogPostSelect>(
          selectType: T, search?: Prisma.BlogPostWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogPostOrderByWithRelationInput | Prisma.BlogPostOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<Prisma.BlogPostGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.blogPost.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching BlogPosts: ", error);
          return [];
     }
});

export const fetchBlogPostById = cache(async <T extends Prisma.BlogPostSelect>(id:string, selectType: T): Promise<Prisma.BlogPostGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.blogPost.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching BlogPost data for id: ${id}`, error);
          return null;
     }
})

export const fetchBlogPostBySlug = cache(async <T extends Prisma.BlogPostSelect>(slug:string, selectType: T): Promise<Prisma.BlogPostGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.blogPost.findUnique({where:{slug},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching BlogPost data for slug: ${slug}`, error);
          return null;
     }
})

export const countBlogPosts = cache(async (search?: Prisma.BlogPostWhereInput): Promise<number> => {
     try {
          const res = await prisma.blogPost.count({where: search});
          return res;
     } catch (error) {
          console.log("Error counting BlogPosts: ", error);
          return 0;
     }
});