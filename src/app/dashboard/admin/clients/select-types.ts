import { Prisma } from "@prisma/client";

// export const AdminClientSelect= {
//      id:true, name:true, phone:true,
//      user: {select:{email:true, image:true}},
//      subscription:{
//           select:{
//                transactions: {select: {proof:true, amount:true, createdAt:true, id:true, payNumber:true, transactionMethod:true}, take:1, orderBy:{createdAt:"desc"}},
//                expiryAt:true,
//                updatedAt:true,
//                subscription :{select:{name:true}}
//           },
//      }

// } satisfies Prisma.ClientSelect;

export const AdminClientSelect= {
     id:true, name:true, phone:true,
     user: {select:{email:true, image:true}},
     subscription:{
          select:{
               id:true,
               transactions: {select: {proof:true,amount:true, createdAt:true, id:true, payNumber:true, transactionMethod:true}, where: {status: "pending"},take:1, orderBy:{createdAt:"desc"}},
               expiryAt:true,
               updatedAt:true,
               subscription :{select:{name:true}}
          },
     }
} satisfies Prisma.ClientSelect;

export type TAdminClientSelect = Prisma.ClientGetPayload<{select: typeof AdminClientSelect }>;