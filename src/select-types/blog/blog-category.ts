import { Prisma } from "@prisma/client";

export const SBlogCategoryOption = {
     id: true,
     name: true,
     slug: true,
     description: true,
} satisfies Prisma.BlogCategorySelect;
export type TBlogCategoryOption = Prisma.BlogCategoryGetPayload<{ select: typeof SBlogCategoryOption }>;

export const SBlogCategoryCard = {
     id: true,
     name: true,
     slug: true,
     description: true,
     createdAt: true,
     _count: { select: { posts: true } },
} satisfies Prisma.BlogCategorySelect;
export type TBlogCategoryCard = Prisma.BlogCategoryGetPayload<{ select: typeof SBlogCategoryCard }>;