/*
  Warnings:

  - Added the required column `userId` to the `patents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patents" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "patents" ADD CONSTRAINT "patents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
