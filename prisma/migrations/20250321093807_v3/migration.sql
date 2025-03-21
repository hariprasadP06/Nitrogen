/*
  Warnings:

  - You are about to drop the column `resturantId` on the `Menu_Items` table. All the data in the column will be lost.
  - You are about to drop the `Resturants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `restaurantId` to the `Menu_Items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Menu_Items" DROP CONSTRAINT "Menu_Items_resturantId_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_resturantId_fkey";

-- AlterTable
ALTER TABLE "Menu_Items" DROP COLUMN "resturantId",
ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Resturants";

-- CreateTable
CREATE TABLE "Restaurants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Restaurants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Menu_Items" ADD CONSTRAINT "Menu_Items_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_resturantId_fkey" FOREIGN KEY ("resturantId") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
