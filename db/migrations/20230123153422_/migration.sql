/*
  Warnings:

  - You are about to drop the column `price` on the `commodityOrder` table. All the data in the column will be lost.
  - You are about to drop the column `shopList` on the `commodityOrder` table. All the data in the column will be lost.
  - Added the required column `address` to the `commodityOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shoplist` to the `commodityOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `commodityOrder` DROP COLUMN `price`,
    DROP COLUMN `shopList`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `shoplist` VARCHAR(191) NOT NULL;
