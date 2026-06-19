/*
  Warnings:

  - Made the column `phoneNo` on table `customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "address" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phoneNo" SET NOT NULL;
