import { Prisma } from "@prisma/client";
import { SBlogCategoryOption } from "./blog-category";
import { SBlogTagOption } from "./blog-tag";

export const SBlogPostEdit = {
     id: true,
     title: true,
     slug: true,
     summary: true,
     content: true,
     status: true,
     featuredImageUrl: true,
     featuredVideoUrl: true,
     images: true,
     videos: true,
     readingTime: true,
     allowComments: true,
     viewsCount: true,
     commentsCount: true,
     publishedAt: true,
     createdAt: true,
     categoryId: true,
     category: { select: SBlogCategoryOption },
     tags: { select: SBlogTagOption },
     author: { select: { id: true, name: true } },
} satisfies Prisma.BlogPostSelect;
export type TBlogPostEdit = Prisma.BlogPostGetPayload<{ select: typeof SBlogPostEdit }>;

export const SBlogPostCard = {
     id: true,
     title: true,
     slug: true,
     summary: true,
     status: true,
     featuredImageUrl: true,
     readingTime: true,
     viewsCount: true,
     commentsCount: true,
     publishedAt: true,
     createdAt: true,
     category: { select: SBlogCategoryOption },
     tags: { select: SBlogTagOption },
     author: { select: { id: true, name: true } },
} satisfies Prisma.BlogPostSelect;
export type TBlogPostCard = Prisma.BlogPostGetPayload<{ select: typeof SBlogPostCard }>;

export const SPubBlogPostCard = {
     id:true, title:true, slug:true, summary: true,
     tags: {select: {name:true, slug:true}},
     category: {select: {name:true, id:true, slug:true}},
     publishedAt: true, featuredImageUrl:true, featuredVideoUrl:true,
     viewsCount: true, commentsCount: true, readingTime: true,
     author: {select: {id:true, name:true}}
} satisfies Prisma.BlogPostSelect;
export type TPubBlogPostCard = Prisma.BlogPostGetPayload<{ select: typeof SPubBlogPostCard }>;

export const SPubBlogPostFull = {
     id: true, title: true, slug: true, summary: true, content: true,
     featuredImageUrl: true, featuredVideoUrl: true, images: true, videos: true,
     publishedAt: true, createdAt: true, readingTime: true,
     viewsCount: true, commentsCount: true, allowComments: true,
     category: {select: {name: true, slug: true}},
     tags: {select: {name: true, slug: true}},
     author: {select: {id: true, name: true}},
} satisfies Prisma.BlogPostSelect;
export type TPubBlogPostFull = Prisma.BlogPostGetPayload<{ select: typeof SPubBlogPostFull }>;