/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { stringToBoolean } from "@/util/stringFuncs";

import { NextResponse as res } from "next/server";

export async function GET(req: Request) {
     try{
          const {searchParams:params} = new URL(req.url);

          const filters: Record<string, string | number | boolean> = {};
          
          const data = await prisma.categoryFeature.findMany(
               {
                    where: {...filters}, 
                    include: {
                         _count: {
                              select:{
                                   postFeatures:true
                              }
                         }
                    }
               }
          );
          const count  = await prisma.categoryFeature.count({where: {...filters}});

          return res.json({data, pagination: {total: count}});
     }catch(error){
          return res.json({Error: "Error fetching categoryFeature info"}, {status: 500});
     }
}