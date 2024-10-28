/*
  Warnings:

  - A unique constraint covering the columns `[userId,option]` on the table `UserSelection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSelection_userId_option_key" ON "UserSelection"("userId", "option");
