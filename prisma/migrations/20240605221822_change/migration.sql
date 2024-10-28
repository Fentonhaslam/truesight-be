/*
  Warnings:

  - You are about to drop the column `locationS` on the `User` table. All the data in the column will be lost.
  - Added the required column `locations` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "locationS",
ADD COLUMN     "locations" TEXT NOT NULL,
ALTER COLUMN "suggestedCareers" SET NOT NULL,
ALTER COLUMN "suggestedCareers" SET DATA TYPE TEXT;
