/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse as res } from "next/server";
export async function GET(requet: NextRequest, { params }: { params: Promise<{ id: string }> }) {
     try {
          const {id} =await params;

          if(!id) return res.json({error: "Invalid subscription id"},{status: 400});

          const subscriptionData = await prisma.subscription.findUnique({
               where: {id:+id}, 
               include: {_count:{select: {clientSubscriptions:true}}}
          });

          if(!subscriptionData) return res.json({error: "Subscription not found"}, {status: 404});

          return res.json({data: subscriptionData}, {status: 200});
     } catch (error) {
          return res.json({error: "server error"}, {status: 500});
     }
     
}