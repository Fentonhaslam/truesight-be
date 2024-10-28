-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "details" TEXT;

-- CreateTable
CREATE TABLE "User_Goals" (
    "userId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,

    CONSTRAINT "User_Goals_pkey" PRIMARY KEY ("userId","goalId")
);

-- AddForeignKey
ALTER TABLE "User_Goals" ADD CONSTRAINT "User_Goals_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("goalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Goals" ADD CONSTRAINT "User_Goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
