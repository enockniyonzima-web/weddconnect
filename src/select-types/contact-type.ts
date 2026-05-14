import { Prisma } from "@prisma/client";

export const SContactType = {
     id:true, 
     name:true,
     type:true, 
     description:true,
     _count: {select:{contacts:true}}
} satisfies Prisma.ContactTypeSelect;
export type TContactType = Prisma.ContactTypeGetPayload<{select: typeof SContactType}>;