-- CreateTable
CREATE TABLE `productColor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NULL,
    `value` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `imgUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `productColor` ADD CONSTRAINT `productColor_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
