-- DropForeignKey
ALTER TABLE "UserSelection" DROP CONSTRAINT "UserSelection_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserSelection" ADD CONSTRAINT "UserSelection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
