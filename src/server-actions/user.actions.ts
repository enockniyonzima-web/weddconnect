"use server";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { authOptions } from "@/common/authOptions";
import { SSessionUser, TSessionUser, TUser } from "@/common/Entities";
import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { getServerSession, Session } from "next-auth";
import { cache } from "react";

export async function createUser (data: Prisma.UserCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.user.create({data});
          if(res) RevalidatePages.user();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating User: ", error);
          return null
     }

}

export async function updateUser (id:string,data: Prisma.UserUpdateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.user.update({where: {id},data});
          if(res) RevalidatePages.user();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating User : ", error);
          return null
     }

}

export async function deleteUser (id:string) {
     try {     
          await requireAdmin();
          const res = await prisma.user.delete({where: {id}});
          if(res) RevalidatePages.user();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating User: ", error);
          return null;
     }

}

export const fetchUsers = cache(async <T extends Prisma.UserSelect>(
          selectType: T, search?: Prisma.UserWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.UserGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          await requireAdmin();
          const res = await prisma.user.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.user.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error fetching Users: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchUserById = cache(async <T extends Prisma.UserSelect>(id:string, selectType: T): Promise<Prisma.UserGetPayload<{select:T}> | null> => {
     try {
          await requireAdmin();
          const res= await prisma.user.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching User data for id: ${id}`, error);
          return null;
     }
})

export const fetchUserByEmail = cache(async <T extends Prisma.UserSelect>(email:string, selectType: T): Promise<Prisma.UserGetPayload<{select:T}> | null> => {
     try {
          await requireAdmin();
          const res= await prisma.user.findUnique({where:{email},select: selectType});
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching User data for email: ${email}`, error);
          return null;
     }
})

export async function getSessionUser ():Promise<{user:TSessionUser | null | undefined, session: Session | null}>{
    const session = await getServerSession(authOptions);
    if(!session) return {user:null, session: null};
    const sessionUser = session.user;
    if(!sessionUser) return {user:null, session};
    if (!sessionUser.email) return {user:null, session: session};
    // Reads only the signed-in user's own record with a fixed, password-free select.
    const user = await prisma.user.findUnique({ where: { email: sessionUser.email }, select: SSessionUser });

    return {user, session};
}