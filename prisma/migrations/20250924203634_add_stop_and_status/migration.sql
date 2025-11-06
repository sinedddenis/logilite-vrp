-- CreateEnum
CREATE TYPE "public"."StopStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'DELIVERED', 'FAILED');

-- CreateTable
CREATE TABLE "public"."Stop" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "status" "public"."StopStatus" NOT NULL DEFAULT 'PENDING',
    "seq" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stop_customerId_idx" ON "public"."Stop"("customerId");

-- CreateIndex
CREATE INDEX "Stop_status_idx" ON "public"."Stop"("status");

-- AddForeignKey
ALTER TABLE "public"."Stop" ADD CONSTRAINT "Stop_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
