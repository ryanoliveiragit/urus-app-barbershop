/*
  Warnings:

  - You are about to drop the column `auth_code` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "auth_code",
ADD COLUMN     "authCode" TEXT;
