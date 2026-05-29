import { Prisma } from "@prisma/client";

export const SClientProfile = {
     id: true,
     name: true,
     phone: true,
     userId: true,
     subscription: {
          select: {
               id: true,
               createdAt: true,
               expiryAt: true,
               subscription: { select: { id: true, name: true, price: true, description: true, currency:true } },
               transactions: {
                    select: { id: true, amount: true, status: true, createdAt: true, transactionMethod: true },
                    orderBy: { createdAt: "desc" as const },
                    take: 5,
               },
          },
     },
} satisfies Prisma.ClientSelect;
export type TClientProfile = Prisma.ClientGetPayload<{ select: typeof SClientProfile }>;

export const SClientSettings = {
     id: true,
     name: true,
     phone: true,
     userId: true,
     user: { select: { id: true, email: true, image: true } },
} satisfies Prisma.ClientSelect;
export type TClientSettings = Prisma.ClientGetPayload<{ select: typeof SClientSettings }>;
