"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

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