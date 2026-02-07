"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export async function createSubscription (data: Prisma.SubscriptionCreateInput) {
     try {     
          const res = await prisma.subscription.create({data});
          if(res) RevalidatePages.subscription();
          return res;
     } catch (error) {
          console.log("Error creating Subscription: ", error);
          return null
     }

}

export async function updateSubscription (id:number,data: Prisma.SubscriptionUpdateInput) {
     try {     
          const res = await prisma.subscription.update({where: {id},data});
          if(res) RevalidatePages.subscription();
          return res;
     } catch (error) {
          console.log("Error creating Subscription : ", error);
          return null
     }

}

export async function deleteSubscription (id:number) {
     try {     
          const res = await prisma.subscription.delete({where: {id}});
          if(res) RevalidatePages.subscription();
          return res;
     } catch (error) {
          console.log("Error creating Subscription: ", error);
          return null
     }

}

export const fetchSubscriptions = cache(async <T extends Prisma.SubscriptionSelect>(
          selectType: T, search?: Prisma.SubscriptionWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.SubscriptionOrderByWithRelationInput | Prisma.SubscriptionOrderByWithRelationInput[]  = { name: 'desc' }
     ):Promise<Prisma.SubscriptionGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.subscription.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching Subscriptions: ", error);
          return [];
     }
});

export const fetchSubscriptionById = cache(async <T extends Prisma.SubscriptionSelect>(id:number, selectType: T): Promise<Prisma.SubscriptionGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.subscription.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Subscription data for id: ${id}`, error);
          return null;
     }
})