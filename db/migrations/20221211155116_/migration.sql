/*
  Warnings:

  - You are about to drop the column `list` on the `shopList` table. All the data in the column will be lost.
  - Added the required column `amount` to the `shopList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assemble` to the `shopList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `battery` to the `shopList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `charger` to the `shopList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `shopList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `shopList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remark` to the `shopList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shopList` DROP COLUMN `list`,
    ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `assemble` VARCHAR(191) NOT NULL,
    ADD COLUMN `battery` VARCHAR(191) NOT NULL,
    ADD COLUMN `charger` BOOLEAN NOT NULL,
    ADD COLUMN `color` VARCHAR(191) NOT NULL,
    ADD COLUMN `model` VARCHAR(191) NOT NULL,
    ADD COLUMN `remark` VARCHAR(191) NOT NULL;
