/*
  Warnings:

  - You are about to drop the `logisticOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orderList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `logisticOrder` DROP FOREIGN KEY `logisticOrder_commodityOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `orderList` DROP FOREIGN KEY `orderList_commodityOrderId_fkey`;

-- AlterTable
ALTER TABLE `commodityOrder` ADD COLUMN `logisticOrderId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `logisticOrder`;

-- DropTable
DROP TABLE `orderList`;
