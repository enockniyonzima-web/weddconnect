"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin, scopePublicQuery } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

// Non-admin visitors may only ever see published posts (drafts and archived posts stay private).
function publishedOnly(admin: boolean, where?: Prisma.BlogPostWhereInput): Prisma.BlogPostWhereInput {
     if (admin) return where ?? {};
     return { AND: [where ?? {}, { status: "PUBLISHED" }] };
}

export async function createBlogPost (data: Prisma.BlogPostCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.blogPost.create({data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating BlogPost: ", error);
          return null
     }

}

export async function updateBlogPost (id:string,data: Prisma.BlogPostUpdateInput) {
     try {
          await requireAdmin();
          const res = await prisma.blogPost.update({where: {id},data});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating BlogPost : ", error);
          return null
     }

}

export async function deleteBlogPost (id:string) {
     try {
          await requireAdmin();
          const res = await prisma.blogPost.delete({where: {id}});
          if(res) RevalidatePages.default();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating BlogPost: ", error);
          return null
     }

}
export const fetchBlogPosts = cache(async <T extends Prisma.BlogPostSelect>(
          selectType: T, search?: Prisma.BlogPostWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.BlogPostOrderByWithRelationInput | Prisma.BlogPostOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<Prisma.BlogPostGetPayload<{select: T}>[]> => {
     try {
          const q = await scopePublicQuery({ select: selectType, where: search, orderBy, take });
          const res = await prisma.blogPost.findMany({ where: publishedOnly(q.admin, q.where), take: q.take, skip, select: q.select, orderBy: q.orderBy });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error fetching BlogPosts: ", error);
          return [];
     }
});

export const fetchBlogPostById = cache(async <T extends Prisma.BlogPostSelect>(id:string, selectType: T): Promise<Prisma.BlogPostGetPayload<{select:T}> | null> => {
     try {
          await requireAdmin();
          const res= await prisma.blogPost.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching BlogPost data for id: ${id}`, error);
          return null;
     }
})

export const fetchBlogPostBySlug = cache(async <T extends Prisma.BlogPostSelect>(slug:string, selectType: T): Promise<Prisma.BlogPostGetPayload<{select:T}> | null> => {
     try {
          const q = await scopePublicQuery({ select: selectType });
          const res = await prisma.blogPost.findFirst({ where: publishedOnly(q.admin, { slug }), select: q.select });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching BlogPost data for slug: ${slug}`, error);
          return null;
     }
})

export const countBlogPosts = cache(async (search?: Prisma.BlogPostWhereInput): Promise<number> => {
     try {
          const q = await scopePublicQuery({ select: {}, where: search });
          const res = await prisma.blogPost.count({ where: publishedOnly(q.admin, q.where) });
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error counting BlogPosts: ", error);
          return 0;
     }
});