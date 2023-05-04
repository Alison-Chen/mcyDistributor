/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `address`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `county` VARCHAR(191) NULL;
