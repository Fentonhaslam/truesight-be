/*
  Warnings:

  - Added the required column `agreeToTerms` to the `Mentee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agreeToTerms` to the `Mentor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mentee" ADD COLUMN     "agreeToTerms" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "agreeToTerms" BOOLEAN NOT NULL;
