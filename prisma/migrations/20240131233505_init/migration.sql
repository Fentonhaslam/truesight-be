-- AddForeignKey
ALTER TABLE "User_Pillars" ADD CONSTRAINT "User_Pillars_pillarId_fkey" FOREIGN KEY ("pillarId") REFERENCES "Pillar"("pillarId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Pillars" ADD CONSTRAINT "User_Pillars_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pillar_Goals" ADD CONSTRAINT "Pillar_Goals_pillarId_fkey" FOREIGN KEY ("pillarId") REFERENCES "Pillar"("pillarId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pillar_Goals" ADD CONSTRAINT "Pillar_Goals_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("goalId") ON DELETE RESTRICT ON UPDATE CASCADE;
