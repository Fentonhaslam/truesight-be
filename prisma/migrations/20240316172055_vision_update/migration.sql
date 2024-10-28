/*
  Warnings:

  - You are about to drop the column `vision` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "vision",
ADD COLUMN     "visions" TEXT[];
