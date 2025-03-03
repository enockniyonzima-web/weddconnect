/* eslint-disable @typescript-eslint/no-unused-vars */

import prisma from "@/lib/prisma";
import { NextResponse as res } from "next/server";

const TUserSelectFields = {
     id:true,email: true, image: true, status:true, type: true, createdAt:true
}

export async function GET() {
     try{
          const data = await prisma.client.findMany({include: {user: {select:TUserSelectFields}, subscription:{include:{subscription:true}}}});
          const total = await prisma.client.count();

          return res.json({data, pagination: {total}});
     }catch(error) {
          return res.json({error: "Error fetching clients"}, {status: 500})
     }
}