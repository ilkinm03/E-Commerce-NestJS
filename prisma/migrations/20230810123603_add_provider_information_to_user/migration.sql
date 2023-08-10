/*
  Warnings:

  - A unique constraint covering the columns `[provided_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provided_id" TEXT,
ADD COLUMN     "provider" TEXT DEFAULT 'local';

-- CreateIndex
CREATE UNIQUE INDEX "User_provided_id_key" ON "User"("provided_id");
