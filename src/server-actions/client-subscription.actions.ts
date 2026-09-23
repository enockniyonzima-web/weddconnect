"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { revalidateFinanceStats } from "@/server-actions/admin-finance";

export async function createClientSubscription (data: Prisma.ClientSubscriptionCreateInput) {
     try {     
          const res = await prisma.clientSubscription.create({data});
          if(res) RevalidatePages.clientSubscription();
          return res;
     } catch (error) {
          console.log("Error creating ClientSubscription: ", error);
          return null
     }

}

export async function updateClientSubscription (id:number,data: Prisma.ClientSubscriptionUpdateInput) {
     try {     
          const res = await prisma.clientSubscription.update({where: {id},data});
          if(res) RevalidatePages.clientSubscription();
          return res;
     } catch (error) {
          console.log("Error creating ClientSubscription : ", error);
          return null
     }

}

export async function deleteClientSubscription (id:number) {
     try {
          const res = await prisma.clientSubscription.delete({where: {id}});
          if(res) RevalidatePages.clientSubscription();
          return res;
     } catch (error) {
          console.log("Error creating Client Subscription: ", error);
          return null
     }

}

// Marks a manually-approved payment's Transaction as PAID (transactionStatus), not just the
// ClientSubscription's expiry — without this, manually-approved revenue is invisible to any
// reporting built on the reliable transactionStatus enum (see finance stats).
export async function approveManualTransaction(clientSubscriptionId: number, transactionId: number, expiryAt: Date) {
     try {
          const res = await prisma.$transaction([
               prisma.transaction.update({ where: { id: transactionId }, data: { transactionStatus: "PAID", status: "paid" } }),
               prisma.clientSubscription.update({ where: { id: clientSubscriptionId }, data: { updatedAt: new Date(), expiryAt } }),
          ]);
          RevalidatePages.clientSubscription();
          RevalidatePages.transaction();
          await revalidateFinanceStats();
          return res;
     } catch (error) {
          console.log("Error approving manual transaction: ", error);
          return null;
     }
}