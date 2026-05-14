-- DropForeignKey
ALTER TABLE "PostFeature" DROP CONSTRAINT "PostFeature_categoryFeatureId_fkey";

-- DropForeignKey
ALTER TABLE "PostFeature" DROP CONSTRAINT "PostFeature_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostImage" DROP CONSTRAINT "PostImage_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_clientId_fkey";

-- DropForeignKey
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostPackage" DROP CONSTRAINT "PostPackage_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostPrice" DROP CONSTRAINT "PostPrice_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostReview" DROP CONSTRAINT "PostReview_clientId_fkey";

-- DropForeignKey
ALTER TABLE "PostReview" DROP CONSTRAINT "PostReview_postId_fkey";

-- AlterTable
ALTER TABLE "PostLike" ALTER COLUMN "clientId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PostReview" ALTER COLUMN "clientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PostFeature" ADD CONSTRAINT "PostFeature_categoryFeatureId_fkey" FOREIGN KEY ("categoryFeatureId") REFERENCES "CategoryFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFeature" ADD CONSTRAINT "PostFeature_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostImage" ADD CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPrice" ADD CONSTRAINT "PostPrice_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPackage" ADD CONSTRAINT "PostPackage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReview" ADD CONSTRAINT "PostReview_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReview" ADD CONSTRAINT "PostReview_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
