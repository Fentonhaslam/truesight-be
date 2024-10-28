/*
  Warnings:

  - You are about to drop the column `name` on the `Mentee` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Mentor` table. All the data in the column will be lost.
  - Added the required column `menteeName` to the `Mentee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mentorName` to the `Mentor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mentee" DROP COLUMN "name",
ADD COLUMN     "menteeName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "name",
ADD COLUMN     "mentorName" TEXT NOT NULL;
