/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNumber]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ETransactionProvider" AS ENUM ('MANUAL', 'IREMBO_PAY');

-- CreateEnum
CREATE TYPE "ETransactionStatus" AS ENUM ('NONE', 'PENDING', 'PAID', 'PARTIALLY_PAID', 'FAILED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "iremboProductCode" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "provider" "ETransactionProvider" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "transactionStatus" "ETransactionStatus" NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_invoiceNumber_key" ON "Transaction"("invoiceNumber");
