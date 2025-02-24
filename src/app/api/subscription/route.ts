/* eslint-disable @typescript-eslint/no-unused-vars */

import prisma from "@/lib/prisma";
import { NextResponse as res } from "next/server";

export async function GET() {
     try{
          const data = await prisma.subscription.findMany({include: {_count:{select: {clientSubscriptions:true}}}});
          return res.json({data});
     }catch(error) {
          return res.json({error: "Error fetching subscriptions"}, {status: 500})
     }
}