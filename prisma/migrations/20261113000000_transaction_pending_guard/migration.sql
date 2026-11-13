-- AlterEnum
ALTER TYPE "ETransactionStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "pendingKey" INTEGER,
ADD COLUMN     "subscriptionId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_pendingKey_key" ON "Transaction"("pendingKey");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
