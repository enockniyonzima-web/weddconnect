"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createTransaction (data: Prisma.TransactionCreateInput) {
     try {     
          const res = await prisma.transaction.create({data});
          if(res) RevalidatePages.transaction();
          return res;
     } catch (error) {
          console.log("Error creating Transaction: ", error);
          return null
     }

}

export async function updateTransaction (id:number,data: Prisma.TransactionUpdateInput) {
     try {     
          const res = await prisma.transaction.update({where: {id},data});
          if(res) RevalidatePages.transaction();
          return res;
     } catch (error) {
          console.log("Error creating Transaction : ", error);
          return null
     }

}

export async function deleteTransaction (id:number) {
     try {     
          const res = await prisma.transaction.delete({where: {id}});
          if(res) RevalidatePages.transaction();
          return res;
     } catch (error) {
          console.log("Error creating Transaction: ", error);
          return null
     }
}

export const fetchTransactions = cache(async <T extends Prisma.TransactionSelect>(
          selectType: T, search?: Prisma.TransactionWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.TransactionOrderByWithRelationInput | Prisma.TransactionOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<Prisma.TransactionGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.transaction.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching Transactions: ", error);
          return [];
     }
});

export const fetchTransactionById = cache(async <T extends Prisma.TransactionSelect>(id:number, selectType: T): Promise<Prisma.TransactionGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.transaction.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Transaction data for id: ${id}`, error);
          return null;
     }
})

export const countTransactions = cache(async (search?: Prisma.TransactionWhereInput): Promise<number> => {
     try {
          const res = await prisma.transaction.count({where: search});
          return res;
     } catch (error) {
          console.log("Error counting Transactions: ", error);
          return 0;
     }
});