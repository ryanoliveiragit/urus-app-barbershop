/*
  Warnings:

  - You are about to drop the column `service` on the `Agendament` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `Agendament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agendament" DROP COLUMN "service",
ADD COLUMN     "serviceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Agendament" ADD CONSTRAINT "Agendament_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
