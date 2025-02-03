"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

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
          console.log("Error creating Post : ", error);
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