/*
  Warnings:

  - Added the required column `shopList` to the `commodityOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `commodityOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `commodityOrder` ADD COLUMN `shopList` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;
