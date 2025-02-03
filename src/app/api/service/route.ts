import prisma from "@/lib/prisma";
import { stringToBoolean } from "@/util/stringFuncs";

import { NextResponse as res } from "next/server";

export async function GET(req: Request) {
     try{
          const {searchParams:params} = new URL(req.url);

          const filters: Record<string, string | number | boolean> = {};

          const status = params.get("status");

          if(status) filters.status = stringToBoolean(status);
          
          const data = await prisma.service.findMany(
               {
                    where: {...filters}
               }
          );
          const count  = await prisma.service.count({where: {...filters}});

          return res.json({data, pagination: {total: count}});
     }catch(error){
          console.log("error fetching service info", error);
          return res.json({Error: "Error fetching service info"});
     }finally{
          prisma.$disconnect();
     }
}