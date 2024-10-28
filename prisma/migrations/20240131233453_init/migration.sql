-- CreateTable
CREATE TABLE "Pillar" (
    "pillarId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT,
    "details" TEXT,
    "timeline" TEXT,
    "priority" TEXT,
    "area" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pillar_pkey" PRIMARY KEY ("pillarId")
);

-- CreateTable
CREATE TABLE "Goal" (
    "goalId" TEXT NOT NULL,
    "pillarId" TEXT,
    "specific" TEXT,
    "measurable" TEXT,
    "achievable" TEXT,
    "relevant" TEXT,
    "timeBound" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("goalId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "personalitySummary" TEXT NOT NULL,
    "valuesSummary" TEXT NOT NULL,
    "skillsSummary" TEXT NOT NULL,
    "skills" TEXT[],
    "interests" TEXT[],
    "vision" TEXT[],
    "benevolence" INTEGER NOT NULL,
    "achievement" INTEGER NOT NULL,
    "conformity" INTEGER NOT NULL,
    "hedonism" INTEGER NOT NULL,
    "power" INTEGER NOT NULL,
    "security" INTEGER NOT NULL,
    "selfDirection" INTEGER NOT NULL,
    "stimulation" INTEGER NOT NULL,
    "tradition" INTEGER NOT NULL,
    "universalism" INTEGER NOT NULL,
    "extraversion" INTEGER NOT NULL,
    "agreeableness" INTEGER NOT NULL,
    "conscientiousness" INTEGER NOT NULL,
    "neuroticism" INTEGER NOT NULL,
    "openness" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "User_Pillars" (
    "userId" TEXT NOT NULL,
    "pillarId" TEXT NOT NULL,

    CONSTRAINT "User_Pillars_pkey" PRIMARY KEY ("userId","pillarId")
);

-- CreateTable
CREATE TABLE "Pillar_Goals" (
    "pillarId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,

    CONSTRAINT "Pillar_Goals_pkey" PRIMARY KEY ("pillarId","goalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
