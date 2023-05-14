-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "orderId" INTEGER;

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "order_no" INTEGER NOT NULL,
    "total_price" REAL NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "payment_method" TEXT,
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "transaction_id" INTEGER,
    "shipping_method" TEXT,
    "tracking_number" TEXT,
    "order_status" TEXT NOT NULL DEFAULT 'pending',
    "order_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery_date" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_no_key" ON "Order"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "Order_transaction_id_key" ON "Order"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_tracking_number_key" ON "Order"("tracking_number");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
