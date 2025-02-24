"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

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