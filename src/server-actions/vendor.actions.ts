"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";

export async function createVendor (data: Prisma.VendorCreateInput) {
     try {     
          const res = await prisma.vendor.create({data});
          if(res) RevalidatePages.vendor();
          return res;
     } catch (error) {
          console.log("Error creating Vendor: ", error);
          return null
     }

}

export async function updateVendor (id:number,data: Prisma.VendorUpdateInput) {
     try {     
          const res = await prisma.vendor.update({where: {id},data});
          if(res) RevalidatePages.vendor();
          return res;
     } catch (error) {
          console.log("Error creating Vendor : ", error);
          return null
     }

}

export async function deleteVendor (id:number) {
     try {     
          const res = await prisma.vendor.delete({where: {id}});
          if(res) RevalidatePages.vendor();
          return res;
     } catch (error) {
          console.log("Error creating Vendor: ", error);
          return null
     }

}