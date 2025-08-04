-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "imgHeight" TEXT,
ADD COLUMN     "imgWidth" TEXT;
