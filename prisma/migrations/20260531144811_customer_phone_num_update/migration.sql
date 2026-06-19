/*
  Warnings:

  - A unique constraint covering the columns `[phoneNo]` on the table `customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customer_phoneNo_key" ON "customer"("phoneNo");
