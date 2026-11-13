"use server";

import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin, scopePublicQuery } from "@/lib/auth-guard";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createContactType (data: Prisma.ContactTypeCreateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.contactType.create({data});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating contact type: ", error);
          return null
     }

}

export async function updateContactType (id:number,data: Prisma.ContactTypeUpdateInput) {
     try {     
          await requireAdmin();
          const res = await prisma.contactType.update({where: {id},data});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating contact type : ", error);
          return null
     }

}

export async function deleteContactType (id:number) {
     try {     
          await requireAdmin();
          const res = await prisma.contactType.delete({where: {id}});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error creating contact type: ", error);
          return null
     }

}

export const fetchContactTypes = cache(async <T extends Prisma.ContactTypeSelect>(
          selectType: T, search?: Prisma.ContactTypeWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.ContactTypeOrderByWithRelationInput | Prisma.ContactTypeOrderByWithRelationInput[]  = { id: 'desc' }
     ):Promise<Prisma.ContactTypeGetPayload<{select: T}>[]> => {
     try {
          const q = await scopePublicQuery({ select: selectType, where: search, orderBy, take });
          const res = await prisma.contactType.findMany({ where: q.where, take: q.take, skip, select: q.select, orderBy: q.orderBy });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error fetching ContactTypes: ", error);
          return [];
     }
});

export const fetchContactTypeById = cache(async <T extends Prisma.ContactTypeSelect>(id:number, selectType: T): Promise<Prisma.ContactTypeGetPayload<{select:T}> | null> => {
     try {
          const q = await scopePublicQuery({ select: selectType });
          const res = await prisma.contactType.findUnique({ where: { id }, select: q.select });
          return q.mask(res);
     } catch (error) {
          unstable_rethrow(error);
          console.log(`Error fetching ContactType data for id: ${id}`, error);
          return null;
     }
})

export const countContactTypes = cache(async (search?: Prisma.ContactTypeWhereInput): Promise<number> => {
     try {
          const q = await scopePublicQuery({ select: {}, where: search });
          const count = await prisma.contactType.count({ where: q.where });
          return count;
     } catch (error) {
          unstable_rethrow(error);
          console.log("Error counting ContactTypes: ", error);
          return 0;
     }
})