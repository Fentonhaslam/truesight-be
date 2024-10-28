/*
  Warnings:

  - You are about to drop the column `mentoringExperience` on the `Mentor` table. All the data in the column will be lost.
  - Added the required column `mentoringBefore` to the `Mentor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "mentoringExperience",
ADD COLUMN     "mentoringBefore" TEXT NOT NULL;
