import { Prisma } from "@prisma/client";

export const SCategory = {
     id:true, name:true, icon:true, description:true, rank:true, status:true, features:true
} satisfies Prisma.CategorySelect;

export type SCategoryType = Prisma.CategoryGetPayload<{select: typeof SCategory}>;

export const SFullCategory = {
     id:true, name:true, icon:true, description:true, rank:true, status:true,
     features:true,
     _count: {select: {posts:true} }
} satisfies Prisma.CategorySelect;

export type SFullCategoryType = Prisma.CategoryGetPayload<{select: typeof SFullCategory}>;