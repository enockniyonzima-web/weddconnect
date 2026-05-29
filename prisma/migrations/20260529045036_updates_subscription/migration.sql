-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "durationUnit" TEXT NOT NULL DEFAULT 'month',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
