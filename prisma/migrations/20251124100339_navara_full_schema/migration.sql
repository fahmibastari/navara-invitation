/*
  Warnings:

  - You are about to drop the column `slug` on the `GallerySection` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GalleryImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GallerySection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `HeroSlide` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `HeroSlide` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `LocationConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RundownItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SiteConfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GalleryImage" DROP CONSTRAINT "GalleryImage_sectionId_fkey";

-- DropIndex
DROP INDEX "GallerySection_slug_key";

-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "order" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "GallerySection" DROP COLUMN "slug",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "HeroSlide" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "order" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "LocationConfig" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "RundownItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "order" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Testimonial" ALTER COLUMN "rating" SET DEFAULT 5;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "GallerySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
