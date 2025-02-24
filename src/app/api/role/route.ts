import prisma from "@/lib/prisma";
import { stringToBoolean } from "@/util/stringFuncs";

import { NextResponse as res } from "next/server";

export async function GET(req: Request) {
     try{
          const {searchParams:params} = new URL(req.url);

          const filters: Record<string, string | number | boolean> = {};

          const status = params.get("status");

          if(status) filters.status = stringToBoolean(status);
          
          const data = await prisma.role.findMany(
               {
                    where: {...filters}, 
                    include: {
                         permissions:true,
                         _count: {
                              select:{
                                   permissions:true
                              }
                         }
                    }
               }
          );
          const count  = await prisma.role.count({where: {...filters}});

          return res.json({data, pagination: {total: count}});
     }catch(error){
          console.log("error fetching role info", error);
          return res.json({Error: "Error fetching role info"}, {status:500});
     }finally{
          prisma.$disconnect();
     }
}