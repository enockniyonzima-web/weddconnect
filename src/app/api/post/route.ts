import prisma from "@/lib/prisma";
import { stringToBoolean } from "@/util/stringFuncs";

import { NextResponse as res } from "next/server";

const TUserSelectFields = {
     id:true,email: true, image: true, status:true, type: true, createdAt:true
}
export async function GET(req: Request) {
     try{
          const {searchParams:params} = new URL(req.url);

          const filters: Record<string, string | number | boolean> = {};

          const status = params.get("status");

          if(status) filters.status = stringToBoolean(status);
          
          const data = await prisma.post.findMany(
               {
                    where: {...filters}, 
                    include:
                         {
                              price:true, images:true, packages:true,
                              features:{include: {categoryFeature:true}}, 
                              _count: {
                                   select:{
                                        likes:true,
                                        reviews:true
                                   }
                              },
                              vendor: {include:{user:{select: TUserSelectFields}, contacts:{include: {contactType:true}}}}, category: true
                         }
               }
          );
          const count  = await prisma.post.count({where: {...filters}});

          return res.json({data, pagination: {total: count}});
     }catch(error){
          console.log("error fetching post info", error);
          return res.json({Error: "Error fetching post info"});
     }finally{
          prisma.$disconnect();
     }
}