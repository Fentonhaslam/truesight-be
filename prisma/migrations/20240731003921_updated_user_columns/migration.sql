/*
  Warnings:

  - You are about to drop the column `assistantId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Mentee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mentor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cvObjectKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interests` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skills` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `values` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "assistantId",
ADD COLUMN     "cvObjectKey" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "interests" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT NOT NULL,
ADD COLUMN     "values" TEXT NOT NULL;

-- DropTable
DROP TABLE "Mentee";

-- DropTable
DROP TABLE "Mentor";
