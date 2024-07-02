-- CreateTable
CREATE TABLE `SalesReport` (
    `id` VARCHAR(191) NOT NULL,
    `dateAdded` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `driver_id` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesReportProducts` (
    `id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `sales` DOUBLE NOT NULL,
    `saleType` ENUM('WHOLESALE', 'RETAIL') NULL,
    `quantity` DOUBLE NULL,
    `status` ENUM('FORSALE', 'SOLD', 'CONFIRMED') NOT NULL DEFAULT 'SOLD',
    `paymentOptions` ENUM('PAY_LATER', 'GCASH', 'CASH') NULL,
    `paymentStatus` ENUM('PAID', 'UNPAID', 'PROCESSING') NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `customerId` VARCHAR(191) NULL,
    `driver_id` VARCHAR(191) NULL,
    `salesReportId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SalesReport` ADD CONSTRAINT `SalesReport_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `Driver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReportProducts` ADD CONSTRAINT `SalesReportProducts_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReportProducts` ADD CONSTRAINT `SalesReportProducts_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReportProducts` ADD CONSTRAINT `SalesReportProducts_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `Driver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReportProducts` ADD CONSTRAINT `SalesReportProducts_salesReportId_fkey` FOREIGN KEY (`salesReportId`) REFERENCES `SalesReport`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
