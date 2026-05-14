import { Prisma } from "@prisma/client";

export const SVendorEdit = {
     id:true,
     name:true,
     status:true,
     user: {select: {email:true, id:true, image:true, }},
     contacts: {select:{id:true, value:true, contactType:{select: {id:true, name:true, type:true}}}}
} satisfies Prisma.VendorSelect;
export type TVendorEdit = Prisma.VendorGetPayload<{select: typeof SVendorEdit}>;

export const SVendorCard = {
     id:true,
     name:true,
     status:true,
     user: {select: {email:true, id:true, image:true, }},
     contacts: {select:{id:true, value:true, contactType:{select: {id:true, name:true, type:true}}}},
     _count: {select:{posts:true, contacts:true}}
} satisfies Prisma.VendorSelect;
export type TVendorCard = Prisma.VendorGetPayload<{select: typeof SVendorCard}>;