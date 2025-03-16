/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { stringToBoolean } from "@/util/stringFuncs";

import { NextResponse as res } from "next/server";

export async function GET(req: Request) {
     try{
          const {searchParams:params} = new URL(req.url);

          const filters: Record<string, string | number | boolean> = {};

          const status = params.get("status");

          if(status) filters.status = stringToBoolean(status);
          
          const data = await prisma.category.findMany(
               {
                    where: {...filters}, 
                    select:{
                         id:true, name:true, status:true, icon:true, description:true,
                         features:true,
                         _count: {
                              select:{
                                   posts:true
                              }
                         }
                    },
                    orderBy: [{id: 'asc'}]
               }
          );
          const count  = await prisma.category.count({where: {...filters}});
          return res.json({data, pagination: {total: count}}, {
               headers: {
                    'Cache-Control': 'no-store, max-age=0',
               },
          });
     }catch(error){
          return res.json({Error: "Error fetching category info"}, {status: 500});
     }
}