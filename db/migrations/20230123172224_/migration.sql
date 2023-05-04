/*
  Warnings:

  - Added the required column `name` to the `commodityOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `commodityOrder` ADD COLUMN `name` VARCHAR(191) NOT NULL;
