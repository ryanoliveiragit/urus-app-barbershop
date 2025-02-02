-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paymentId" TEXT;

-- CreateTable
CREATE TABLE "OrderPayment" (
    "id" SERIAL NOT NULL,
    "paymentId" TEXT DEFAULT '',

    CONSTRAINT "OrderPayment_pkey" PRIMARY KEY ("id")
);
