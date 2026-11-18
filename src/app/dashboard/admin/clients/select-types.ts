import { Prisma } from "@prisma/client";
import { PENDING_TX_WHERE } from "@/lib/admin/client-status";

export const AdminClientSelect= {
     id:true, name:true, phone:true,
     user: {select:{email:true, image:true, createdAt:true}},
     subscription:{
          select:{
               id:true,
               // The client's open payment (IremboPay invoice or manual request), if any.
               transactions: {select: {proof:true,amount:true, createdAt:true, id:true, payNumber:true, transactionMethod:true, provider:true, invoiceNumber:true, status:true, transactionStatus:true}, where: PENDING_TX_WHERE, take:1, orderBy:{createdAt:"desc"}},
               expiryAt:true,
               createdAt:true,
               updatedAt:true,
               subscription :{select:{name:true, id:true, price:true, currency:true, duration:true, durationUnit:true}}
          },
     }
} satisfies Prisma.ClientSelect;

export type TAdminClientSelect = Prisma.ClientGetPayload<{select: typeof AdminClientSelect }>;
