import { Prisma } from "@prisma/client";

export const STransactionPending = {
     id: true,
     status: true,
     createdAt: true,
     payNumber: true,
     transactionMethod: true,
     amount: true,
} satisfies Prisma.TransactionSelect;
export type TTransactionPending = Prisma.TransactionGetPayload<{ select: typeof STransactionPending }>;

export const STransactionAdmin = {
     id: true,
     amount: true,
     price: true,
     quantity: true,
     status: true,
     transactionStatus: true,
     provider: true,
     paymentMethod: true,
     transactionMethod: true,
     payNumber: true,
     proof: true,
     invoiceNumber: true,
     verificationCode: true,
     createdAt: true,
     updatedAt: true,
     clientSubscription: {
          select: {
               id: true,
               expiryAt: true,
               subscription: { select: { id: true, name: true, price: true, currency: true } },
               client: {
                    select: {
                         id: true,
                         name: true,
                         phone: true,
                         user: { select: { email: true, image: true } },
                    },
               },
          },
     },
} satisfies Prisma.TransactionSelect;
export type TTransactionAdmin = Prisma.TransactionGetPayload<{ select: typeof STransactionAdmin }>;
