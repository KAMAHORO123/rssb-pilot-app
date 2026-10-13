-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'COURIER');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('CREATED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'DELAYED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courier" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleType" TEXT,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Courier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "pickupAddress" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'CREATED',
    "createdById" TEXT NOT NULL,
    "assignedCourierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingEvent" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "locationLat" DOUBLE PRECISION,
    "locationLng" DOUBLE PRECISION,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Courier_userId_key" ON "Courier"("userId");

-- CreateIndex
CREATE INDEX "TrackingEvent_shipmentId_createdAt_idx" ON "TrackingEvent"("shipmentId", "createdAt");

-- AddForeignKey
ALTER TABLE "Courier" ADD CONSTRAINT "Courier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_assignedCourierId_fkey" FOREIGN KEY ("assignedCourierId") REFERENCES "Courier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingEvent" ADD CONSTRAINT "TrackingEvent_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
