
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
          
          const data = await prisma.user.findMany(
               {
                    where: {...filters}, 
                    select: {
                         id: true, email: true, image: true, status: true, type: true, createdAt: true,
                         client: true,
                         vendor:{include: {contacts: {include: {contactType:true}}}},
                         admin:true,
                    }
               }
          );
          const count  = await prisma.user.count({where: {...filters}});

          return res.json({data, pagination: {total: count}});
     }catch(error){
          console.log("error fetching user info", error);
          return res.json({Error: "Error fetching user info"});
     }
}