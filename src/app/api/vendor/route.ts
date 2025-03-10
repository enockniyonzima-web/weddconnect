import prisma from "@/lib/prisma";
import { stringToBoolean } from "@/util/stringFuncs";

import { NextResponse as res } from "next/server";

export async function GET(req: Request) {
     try{
          const {searchParams:params} = new URL(req.url);

          const filters: Record<string, string | number | boolean> = {};

          const status = params.get("status");

          if(status) filters.status = stringToBoolean(status);
          
          const data = await prisma.vendor.findMany(
               {
                    where: {...filters}, 
                    include: {
                         _count: {
                              select:{
                                   posts:true
                              }
                         },
                         contacts: {include: {contactType:true}}
                    }
               }
          );
          const count  = await prisma.vendor.count({where: {...filters}});

          return res.json({data, pagination: {total: count}});
     }catch(error){
          console.log("error fetching vendor info", error);
          return res.json({Error: "Error fetching vendor info"});
     }finally{
          prisma.$disconnect();
     }
}