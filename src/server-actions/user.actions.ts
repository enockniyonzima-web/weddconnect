"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

export async function createUser (data: Prisma.UserCreateInput) {
     try {     
          const res = await prisma.user.create({data});
          if(res) RevalidatePages.user();
          return res;
     } catch (error) {
          console.log("Error creating User: ", error);
          return null
     }

}

export async function updateUser (id:string,data: Prisma.UserUpdateInput) {
     try {     
          const res = await prisma.user.update({where: {id},data});
          if(res) RevalidatePages.user();
          return res;
     } catch (error) {
          console.log("Error creating User : ", error);
          return null
     }

}

export async function deleteUser (id:string) {
     try {     
          const res = await prisma.user.delete({where: {id}});
          if(res) RevalidatePages.user();
          return res;
     } catch (error) {
          console.log("Error creating User: ", error);
          return null
     }

}