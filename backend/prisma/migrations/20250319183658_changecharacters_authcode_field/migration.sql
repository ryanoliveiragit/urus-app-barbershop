/*
  Warnings:

  - You are about to alter the column `authCode` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "authCode" SET DATA TYPE VARCHAR(6);
