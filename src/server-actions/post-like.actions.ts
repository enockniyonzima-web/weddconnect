"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

export async function createPostLike (data: Prisma.PostLikeCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.postLike.create({data});
          if(res) RevalidatePages.postLike();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating PostLike: ", error);
          return null
     }

}

export async function updatePostLike (id:number,data: Prisma.PostLikeUpdateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.postLike.update({where: {id},data});
          if(res) RevalidatePages.postLike();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating PostLike : ", error);
          return null
     }

}

export async function deletePostLike (id:number) {
     try {     
          await requireAdmin();
          const res = await prisma.postLike.delete({where: {id}});
          if(res) RevalidatePages.postLike();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating PostLike: ", error);
          return null
     }

}