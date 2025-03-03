/*
  Warnings:

  - Added the required column `inFilter` to the `CategoryFeature` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryFeature" ADD COLUMN     "inFilter" BOOLEAN NOT NULL;
