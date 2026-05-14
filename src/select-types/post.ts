import { Prisma } from "@prisma/client";
import { SCategoryFeature } from "./category-feature";

export const SAdminPostCard = {
     id:true,
     title:true,
     description:true,
     status:true,
     location:true,
     sortOrder:true,
     createdAt:true,
     features:{select: {id:true, value:true, postId:true, categoryFeature: {select: SCategoryFeature}},orderBy:{categoryFeature:{rank:"asc"}}},
     price:{select:{min:true, max:true, currency:true}},
     images:{select:{url:true, id:true, sortOrder:true, name:true, postId:true}, orderBy:{sortOrder:"asc"}},
     category: {select: {id:true, name:true}},
     vendor: {select: {id:true, name:true}},
     _count: {select:{likes:true, reviews:true}}
} satisfies Prisma.PostSelect;
export type TAdminPostCard = Prisma.PostGetPayload<{select: typeof SAdminPostCard}>;

export const SPostEdit = {
     id:true,
     title:true,
     description:true,
     status:true,
     location:true,
     sortOrder:true,
     features:{select: {id:true, value:true, categoryFeature: {select: SCategoryFeature}},orderBy:{categoryFeature:{rank:"asc"}}},
     price:{select:{min:true, max:true, currency:true}},
     images:{select:{url:true, id:true, sortOrder:true, name:true, postId:true}, orderBy:{sortOrder:"asc"}},
     packages: {select:{id:true, name:true, description:true, price: true, sortOrder:true}},
     category: {select: {id:true, name:true}},
     vendor: {select: {id:true, name:true}},
} satisfies Prisma.PostSelect;
export type TPostEdit = Prisma.PostGetPayload<{select: typeof SPostEdit}>;