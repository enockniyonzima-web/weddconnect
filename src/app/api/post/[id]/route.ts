/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { unstable_rethrow } from "next/navigation";
import { requireSubscriberOrAdmin } from "@/lib/auth-guard";
import { NextRequest, NextResponse as res } from "next/server";

const TUserSelectFields = {
     id:true, image: true
}
export async function GET(requet: NextRequest, { params }: { params: Promise<{ id: string }> }) {
     try {
          await requireSubscriberOrAdmin();
     } catch (error) {
          unstable_rethrow(error);
          return res.json({ error: "Unauthorized" }, { status: 401 });
     }
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