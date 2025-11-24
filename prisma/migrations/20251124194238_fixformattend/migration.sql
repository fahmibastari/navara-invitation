/*
  Warnings:

  - You are about to drop the column `guestsCount` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "guestsCount",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "status",
ADD COLUMN     "attendanceOption" TEXT NOT NULL DEFAULT 'yes',
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "institution" TEXT,
ALTER COLUMN "email" SET NOT NULL;
