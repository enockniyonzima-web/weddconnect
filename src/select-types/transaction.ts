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
