/*
  Warnings:

  - You are about to alter the column `price` on the `Menu_Items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[id]` on the table `Menu_Items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Order_Items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `items` to the `Order_Items` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `quantity` on the `Order_Items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Menu_Items" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "isAvailable" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Order_Items" ADD COLUMN     "items" TEXT NOT NULL,
DROP COLUMN "quantity",
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "status" SET DEFAULT 'Placed',
ALTER COLUMN "orderTime" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Menu_Items_id_key" ON "Menu_Items"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_Items_id_key" ON "Order_Items"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");
