/*
  Warnings:

  - You are about to drop the column `achievement` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `agreeableness` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `benevolence` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `conformity` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `conscientiousness` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `extraversion` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hedonism` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `interests` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `neuroticism` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `openness` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `personalitySummary` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pillars` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `power` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `security` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `selfDirection` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `skillsSummary` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stimulation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tradition` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `universalism` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `valuesSummary` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `visions` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pillar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pillar_Goals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Goals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Pillars` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ageGroup` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assistantId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `careerStage` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vision` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pillar_Goals" DROP CONSTRAINT "Pillar_Goals_goalId_fkey";

-- DropForeignKey
ALTER TABLE "Pillar_Goals" DROP CONSTRAINT "Pillar_Goals_pillarId_fkey";

-- DropForeignKey
ALTER TABLE "User_Goals" DROP CONSTRAINT "User_Goals_goalId_fkey";

-- DropForeignKey
ALTER TABLE "User_Goals" DROP CONSTRAINT "User_Goals_userId_fkey";

-- DropForeignKey
ALTER TABLE "User_Pillars" DROP CONSTRAINT "User_Pillars_pillarId_fkey";

-- DropForeignKey
ALTER TABLE "User_Pillars" DROP CONSTRAINT "User_Pillars_userId_fkey";

-- DropIndex
DROP INDEX "User_phone_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "achievement",
DROP COLUMN "agreeableness",
DROP COLUMN "benevolence",
DROP COLUMN "conformity",
DROP COLUMN "conscientiousness",
DROP COLUMN "extraversion",
DROP COLUMN "hedonism",
DROP COLUMN "interests",
DROP COLUMN "neuroticism",
DROP COLUMN "openness",
DROP COLUMN "overview",
DROP COLUMN "personalitySummary",
DROP COLUMN "phone",
DROP COLUMN "pillars",
DROP COLUMN "power",
DROP COLUMN "security",
DROP COLUMN "selfDirection",
DROP COLUMN "skills",
DROP COLUMN "skillsSummary",
DROP COLUMN "stimulation",
DROP COLUMN "tradition",
DROP COLUMN "universalism",
DROP COLUMN "username",
DROP COLUMN "valuesSummary",
DROP COLUMN "visions",
ADD COLUMN     "ageGroup" TEXT NOT NULL,
ADD COLUMN     "assistantId" TEXT NOT NULL,
ADD COLUMN     "careerStage" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "locationS" TEXT[],
ADD COLUMN     "suggestedCareers" TEXT[],
ADD COLUMN     "threadId" TEXT NOT NULL,
ADD COLUMN     "vision" TEXT NOT NULL;

-- DropTable
DROP TABLE "Goal";

-- DropTable
DROP TABLE "Pillar";

-- DropTable
DROP TABLE "Pillar_Goals";

-- DropTable
DROP TABLE "User_Goals";

-- DropTable
DROP TABLE "User_Pillars";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
