"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

export async function createContactType (data: Prisma.ContactTypeCreateInput) {
     try {     
          const res = await prisma.contactType.create({data});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          console.log("Error creating contact type: ", error);
          return null
     }

}

export async function updateContactType (id:number,data: Prisma.ContactTypeUpdateInput) {
     try {     
          const res = await prisma.contactType.update({where: {id},data});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          console.log("Error creating contact type : ", error);
          return null
     }

}

export async function deleteContactType (id:number) {
     try {     
          const res = await prisma.contactType.delete({where: {id}});
          if(res) RevalidatePages.category();
          return res;
     } catch (error) {
          console.log("Error creating contact type: ", error);
          return null
     }

}