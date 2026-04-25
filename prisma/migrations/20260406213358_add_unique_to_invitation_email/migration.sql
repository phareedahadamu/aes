/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Invitation_token_idx";

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "used" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_email_key" ON "Invitation"("email");
