-- AlterTable
ALTER TABLE "public"."Stop" ADD COLUMN     "routeId" TEXT;

-- CreateTable
CREATE TABLE "public"."Route" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "serviceDate" DATE NOT NULL,
    "totalMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Route_driverId_serviceDate_idx" ON "public"."Route"("driverId", "serviceDate");

-- CreateIndex
CREATE INDEX "Stop_routeId_idx" ON "public"."Stop"("routeId");

-- AddForeignKey
ALTER TABLE "public"."Stop" ADD CONSTRAINT "Stop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
