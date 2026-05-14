-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "PostImage" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PostPackage" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
