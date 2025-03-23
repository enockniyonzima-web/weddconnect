import prisma from "@/lib/prisma";

import { NextResponse as res } from "next/server";

const TUserSelectFields = {
     id:true,email: true, image: true, status:true, type: true, createdAt:true
}
export async function GET(req: Request) {
     try{
          const {searchParams:params} = new URL(req.url);
          const page:{skip:number, take:number} = {skip:0, take: 20};

          const filters: Record<string, string | number | boolean> = {};

          const status = params.get("status");
          const category= params.get('category');
          const nextPage = params.get("page");
          const take = params.get("take");

          if(take) page.take = +take;
          if(nextPage) page.skip = ((+nextPage - 1) * page.take);

          if(status) filters.status = status;
          if(category) filters.categoryId = Number(category);
          
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
                    },
                    orderBy:[{id:"desc"}]
               }
          );
          const count  = await prisma.post.count({where: {...filters}});

          return res.json({data, pagination: {total: count}});
     }catch(error){
          console.log("error fetching post info", error);
          return res.json({Error: "Error fetching post info"});
     }
}