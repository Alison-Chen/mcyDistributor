/*
  Warnings:

  - You are about to drop the column `amount` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `amount`;

-- AlterTable
ALTER TABLE `productColor` ADD COLUMN `amount` INTEGER NOT NULL DEFAULT 1;
