import { Prisma } from "@prisma/client";

export const SBlogTagOption = {
     id: true,
     name: true,
     slug: true,
} satisfies Prisma.BlogTagSelect;
export type TBlogTagOption = Prisma.BlogTagGetPayload<{ select: typeof SBlogTagOption }>;

export const SBlogTagCard = {
     id: true,
     name: true,
     slug: true,
     createdAt: true,
     _count: { select: { posts: true } },
} satisfies Prisma.BlogTagSelect;
export type TBlogTagCard = Prisma.BlogTagGetPayload<{ select: typeof SBlogTagCard }>;