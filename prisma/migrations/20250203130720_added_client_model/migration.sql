/*
  Warnings:

  - You are about to drop the column `userId` on the `PostLike` table. All the data in the column will be lost.
  - You are about to drop the `ServiceOrder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientId` to the `PostLike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `PostReview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceOrder" DROP CONSTRAINT "ServiceOrder_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceOrder" DROP CONSTRAINT "ServiceOrder_userId_fkey";

-- AlterTable
ALTER TABLE "PostLike" DROP COLUMN "userId",
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PostReview" ADD COLUMN     "clientId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ServiceOrder";

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_key" ON "Client"("phone");

-- AddForeignKey
ALTER TABLE "PostReview" ADD CONSTRAINT "PostReview_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
