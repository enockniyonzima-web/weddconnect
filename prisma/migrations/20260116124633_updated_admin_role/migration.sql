-- CreateEnum
CREATE TYPE "EAdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "type" "EAdminRole" NOT NULL DEFAULT 'ADMIN';
