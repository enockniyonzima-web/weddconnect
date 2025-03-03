/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse as res } from "next/server";
export async function GET(requet: NextRequest, { params }: { params: Promise<{ id: string }> }) {
     try {
          const {id} =await params;

          if(!id) return res.json({error: "Invalid category id"},{status: 400});

          const categoryData = await prisma.category.findUnique({
               where: {id:+id}, 
               include: {features:true}
          });

          if(!categoryData) return res.json({error: "Category not found"}, {status: 404});

          return res.json({data: categoryData}, {status: 200});
     } catch (error) {
          return res.json({error: "server error"}, {status: 500});
     }
     
}