"use server";

import { authOptions } from "@/common/authOptions";
import { TUser } from "@/common/Entities";
import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { getServerSession, Session } from "next-auth";

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

export async function getSessionUser ():Promise<{user:TUser | null | undefined, session: Session | null}>{
     const session = await getServerSession(authOptions);
     if(!session) return {user:null, session: null};
     const sessionUser = session.user;
     if(!sessionUser) return {user:null, session};
     if (!sessionUser.email) return {user:null, session: session};
     const user = await prisma.user.findUnique({where: {email: sessionUser.email}, include: {client: {include:{subscription:true}}, vendor: true, admin:true}}) as unknown as TUser;

     return {user, session};
}