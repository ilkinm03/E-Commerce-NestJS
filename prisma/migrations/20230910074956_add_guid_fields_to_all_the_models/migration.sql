/*
  Warnings:

  - A unique constraint covering the columns `[guid]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guid]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guid]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guid]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guid` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guid` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guid` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guid` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "guid" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "guid" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "guid" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "guid" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "guid" VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_guid_key" ON "Order"("guid");

-- CreateIndex
CREATE INDEX "Order_guid_idx" ON "Order"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_guid_key" ON "Permission"("guid");

-- CreateIndex
CREATE INDEX "Permission_guid_idx" ON "Permission"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "Product_guid_key" ON "Product"("guid");

-- CreateIndex
CREATE INDEX "Product_guid_idx" ON "Product"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "Role_guid_key" ON "Role"("guid");

-- CreateIndex
CREATE INDEX "Role_guid_idx" ON "Role"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "User_guid_key" ON "User"("guid");

-- CreateIndex
CREATE INDEX "User_guid_idx" ON "User"("guid");
