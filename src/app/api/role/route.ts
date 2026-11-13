import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { stringToBoolean } from "@/util/stringFuncs";

import { NextResponse as res } from "next/server";

export async function GET(req: Request) {
     try {
          await requireAdmin();
     } catch (error) {
          unstable_rethrow(error);
          return res.json({ error: "Unauthorized" }, { status: 401 });
     }
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
     }
}