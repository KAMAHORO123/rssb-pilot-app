import "../src/env/load-env";
import { PrismaClient, Role, ShipmentStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" }
  });
  if (existingAdmin) {
    // Idempotency: keep seed stable across restarts.
    return;
  }

  const adminPasswordHash = await bcrypt.hash("Admin12345!", 10);
  const courierPasswordHash = await bcrypt.hash("Courier12345!", 10);
  const userPasswordHash = await bcrypt.hash("User12345!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: adminPasswordHash,
      role: Role.ADMIN
    }
  });

  const courierUser = await prisma.user.create({
    data: {
      email: "courier@example.com",
      password: courierPasswordHash,
      role: Role.COURIER
    }
  });

  const courier = await prisma.courier.create({
    data: {
      userId: courierUser.id,
      vehicleType: "VAN",
      availability: true
    }
  });

  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      password: userPasswordHash,
      role: Role.USER
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      password: userPasswordHash,
      role: Role.USER
    }
  });

  const shipment1 = await prisma.shipment.create({
    data: {
      title: "Demo Shipment 1",
      description: "Seeded shipment for tracking UI demo.",
      pickupAddress: "Warehouse A",
      deliveryAddress: "Customer B",
      createdById: user1.id,
      assignedCourierId: courier.id,
      status: ShipmentStatus.IN_TRANSIT
    }
  });

  const shipment2 = await prisma.shipment.create({
    data: {
      title: "Demo Shipment 2",
      pickupAddress: "Warehouse A",
      deliveryAddress: "Customer C",
      createdById: user2.id,
      status: ShipmentStatus.CREATED
    }
  });

  await prisma.trackingEvent.createMany({
    data: [
      {
        shipmentId: shipment1.id,
        status: ShipmentStatus.CREATED,
        locationLat: 41.0082,
        locationLng: 28.9784,
        note: "Shipment created."
      },
      {
        shipmentId: shipment1.id,
        status: ShipmentStatus.ASSIGNED,
        locationLat: 41.0085,
        locationLng: 28.9792,
        note: `Courier assigned: ${courierUser.id}`
      },
      {
        shipmentId: shipment1.id,
        status: ShipmentStatus.IN_TRANSIT,
        locationLat: 41.009,
        locationLng: 28.981,
        note: "Left the warehouse."
      }
    ]
  });
}

seed()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

