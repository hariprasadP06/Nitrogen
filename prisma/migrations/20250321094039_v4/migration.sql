/*
  Warnings:

  - You are about to drop the column `resturantId` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `restaurantId` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_resturantId_fkey";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "resturantId",
ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
