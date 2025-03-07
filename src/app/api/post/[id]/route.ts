/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse as res } from "next/server";

const TUserSelectFields = {
     id:true,email: true, image: true, status:true, type: true, createdAt:true
}
export async function GET(requet: NextRequest, { params }: { params: Promise<{ id: string }> }) {
     try {
          const {id} =await params;

          if(!id) return res.json({error: "Invalid category id"},{status: 400});

          const postData = await prisma.post.findUnique({
               where: {id:+id}, 
               include:
                    {
                         price:true, images:true, 
                         features:{include: {categoryFeature:true}}, 
                         likes:true, packages:true, reviews:true,
                         vendor: {include:{user:{select: TUserSelectFields}, contacts:{include: {contactType:true}}}}, category: true
                    }
          });

          if(!postData) return res.json({error: "Post not found"}, {status: 404});

          return res.json({data: postData}, {status: 200});
     } catch (error) {
          return res.json({error: "server error"}, {status: 500});
     }
     
}