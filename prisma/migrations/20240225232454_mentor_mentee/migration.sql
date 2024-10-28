-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pillars" TEXT[];

-- CreateTable
CREATE TABLE "Mentor" (
    "mentorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "areaOfExpertise" TEXT NOT NULL,
    "mentoringExperience" BOOLEAN NOT NULL,
    "commitTime" BOOLEAN NOT NULL,
    "goals" TEXT[],
    "agreeToContact" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("mentorId")
);

-- CreateTable
CREATE TABLE "Mentee" (
    "menteeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "areaOfInterest" TEXT NOT NULL,
    "selfAware" BOOLEAN NOT NULL,
    "meaningfulCareer" BOOLEAN NOT NULL,
    "seekGuidance" BOOLEAN NOT NULL,
    "agreeToContact" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Mentee_pkey" PRIMARY KEY ("menteeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_email_key" ON "Mentor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mentee_email_key" ON "Mentee"("email");
