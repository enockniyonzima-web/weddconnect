import { Prisma } from "@prisma/client";

export const SCategoryFeature = {
     id:true,
     name:true,
     onCard:true,
     rank:true,
     type:true,
     icon:true,
     inFilter:true,
     required:true,
} satisfies Prisma.CategoryFeatureSelect;
export type TCategoryFeature = Prisma.CategoryFeatureGetPayload<{select: typeof SCategoryFeature}>;