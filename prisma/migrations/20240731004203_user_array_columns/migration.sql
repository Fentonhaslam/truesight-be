/*
  Warnings:

  - The `suggestedCareers` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locations` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interests` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `skills` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `values` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "suggestedCareers",
ADD COLUMN     "suggestedCareers" TEXT[],
DROP COLUMN "locations",
ADD COLUMN     "locations" TEXT[],
DROP COLUMN "interests",
ADD COLUMN     "interests" TEXT[],
DROP COLUMN "skills",
ADD COLUMN     "skills" TEXT[],
DROP COLUMN "values",
ADD COLUMN     "values" TEXT[];
