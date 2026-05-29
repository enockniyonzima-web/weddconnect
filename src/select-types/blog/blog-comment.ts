import { Prisma } from "@prisma/client";

export const SPubBlogComment = {
     id: true,
     content: true,
     createdAt: true,
     parentCommentId: true,
     commenter: { select: { id: true, image: true, email:true } },
     replies: {
          select: {
               id: true,
               content: true,
               createdAt: true,
               parentCommentId: true,
               commenter: { select: { id: true, email:true, image: true } },
          },
          orderBy: { createdAt: "asc" as const },
     },
} satisfies Prisma.BlogCommentSelect;
export type TPubBlogComment = Prisma.BlogCommentGetPayload<{ select: typeof SPubBlogComment }>;
