-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `birth` DATETIME(3) NULL,
    ADD COLUMN `companyName` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `taxId` VARCHAR(191) NULL;
