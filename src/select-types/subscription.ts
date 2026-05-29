import { Prisma } from "@prisma/client";

export const SSubscriptionCard = {
     id: true,
     name: true,
     price: true,
     currency:true,
     description: true,
     benefits: true,
     duration: true,
     durationUnit: true,
     isActive: true,
} satisfies Prisma.SubscriptionSelect;
export type TSubscriptionCard = Prisma.SubscriptionGetPayload<{ select: typeof SSubscriptionCard }>;


export const SSubscriptionEdit = {
     id: true,
     name: true,
     price: true,
     currency:true,
     description: true,
     benefits: true,
     duration: true,
     durationUnit: true,
     isActive: true,
} satisfies Prisma.SubscriptionSelect;
export type TSubscriptionEdit = Prisma.SubscriptionGetPayload<{ select: typeof SSubscriptionEdit }>;

export const SAdminSubscriptionCard = {
     id: true,
     name: true,
     price: true,
     currency: true,
     description: true,
     benefits: true,
     duration: true,
     durationUnit: true,
     isActive: true,
     _count: { select: { clientSubscriptions: true } },
     clientSubscriptions: {
          select: {
               id: true,
               createdAt: true,
               expiryAt: true,
               client: { select: { id: true, name: true, phone: true } },
               transactions: {
                    select: { id: true, amount: true, status: true, createdAt: true },
                    where: { status: "APPROVED" },
               },
          },
     },
} satisfies Prisma.SubscriptionSelect;
export type TAdminSubscriptionCard = Prisma.SubscriptionGetPayload<{ select: typeof SAdminSubscriptionCard }>;
