/*
  Warnings:

  - Added the required column `price` to the `commodityOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `commodityOrder` ADD COLUMN `price` INTEGER NOT NULL;
