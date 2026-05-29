import { Prisma } from "@prisma/client";

export const SClientSubscriptionFull = {
     id: true,
     createdAt: true,
     updatedAt: true,
     expiryAt: true,
     subscriptionId: true,
     subscription: {
          select: {
               id: true,
               name: true,
               price: true,
               currency: true,
               duration: true,
               durationUnit: true,
               benefits: true,
               description: true,
          }
     },
     transactions: {
          select: {
               id: true,
               status: true,
               createdAt: true,
               payNumber: true,
               transactionMethod: true,
               amount: true,
          },
          orderBy: { createdAt: "desc" as const },
          take: 1,
     }
} satisfies Prisma.ClientSubscriptionSelect;
export type TClientSubscriptionFull = Prisma.ClientSubscriptionGetPayload<{ select: typeof SClientSubscriptionFull }>;
