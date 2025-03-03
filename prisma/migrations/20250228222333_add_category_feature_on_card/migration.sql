/*
  Warnings:

  - Added the required column `onCard` to the `CategoryFeature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `CategoryFeature` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryFeature" ADD COLUMN     "onCard" BOOLEAN NOT NULL,
ADD COLUMN     "rank" INTEGER NOT NULL;
