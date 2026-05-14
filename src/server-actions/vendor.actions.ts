"use server";

import prisma from "@/lib/prisma";
import { RevalidatePages } from "@/services/Server";
import { Prisma } from "@prisma/client";
import { cache } from "react";

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
          console.log("Error updating Vendor : ", error);
          return null
     }

}

export async function deleteVendor (id:number) {
     try {
          const res = await prisma.$transaction(
               async(tx) => {
                    const vendor = await tx.vendor.findUnique({where: {id}, select:{userId:true}});
                    if(!vendor) throw new Error("Vendor not found");
                    const res = await tx.user.delete({where: {id: vendor.userId}});
                    if(!res) throw new Error("Deletion failed");
                    return res;
               }
          );
          return res
     } catch (error) {
          console.log("Error deleting Vendor: ", error);
          return null
     }

}

export async function deleteVendorContact (vendorId:number, contactId:number) {
     try {
          const res  = await prisma.vendorContact.delete({where: {id: contactId, vendorId}});
          if(res) RevalidatePages.vendor();
          return res;
     } catch (error) {
          console.log("Error deleting contact: ", error);
          return null
     }
}

export const fetchVendors = cache(async <T extends Prisma.VendorSelect>(
          selectType: T, search?: Prisma.VendorWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.VendorOrderByWithRelationInput | Prisma.VendorOrderByWithRelationInput[]  = { id: 'desc' }
     ):Promise<Prisma.VendorGetPayload<{select: T}>[]> => {
     try {
          const res = await prisma.vendor.findMany({where: search, take, skip, select: selectType, orderBy});
          return res;
     } catch (error) {
          console.log("Error fetching Vendors: ", error);
          return [];
     }
});

export const fetchVendorById = cache(async <T extends Prisma.VendorSelect>(id:number, selectType: T): Promise<Prisma.VendorGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.vendor.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Vendor data for id: ${id}`, error);
          return null;
     }
})

export const countVendors = cache(async (search?: Prisma.VendorWhereInput): Promise<number> => {
     try {
          const count = await prisma.vendor.count({where: search});
          return count;
     } catch (error) {
          console.log("Error counting Vendors: ", error);
          return 0;
     }
})