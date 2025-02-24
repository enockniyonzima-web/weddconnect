"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

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