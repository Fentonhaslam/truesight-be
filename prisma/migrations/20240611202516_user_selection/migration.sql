-- CreateTable
CREATE TABLE "UserSelection" (
    "selectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSelection_pkey" PRIMARY KEY ("selectionId")
);

-- AddForeignKey
ALTER TABLE "UserSelection" ADD CONSTRAINT "UserSelection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
