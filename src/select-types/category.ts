import { Prisma } from "@prisma/client";

export const SCategory = {
     id:true, name:true, icon:true, description:true, rank:true, status:true, features:true,
} satisfies Prisma.CategorySelect;

export type TCategory = Prisma.CategoryGetPayload<{select: typeof SCategory}>;

export const SFullCategory = {
     id:true, name:true, icon:true, description:true, rank:true, status:true,
     features:true,
     _count: {select: {posts:true} }
} satisfies Prisma.CategorySelect;

export type TFullCategory = Prisma.CategoryGetPayload<{select: typeof SFullCategory}>;

export const SCategorySimple = {
     id:true, name:true, features:true, _count: {select: {posts:true} }
} satisfies Prisma.CategorySelect;

export type TCategorySimple = Prisma.CategoryGetPayload<{select: typeof SCategorySimple}>;