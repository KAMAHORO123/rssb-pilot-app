import { CouriersService } from "./couriers.service";

describe("CouriersService", () => {
  function buildPrisma(overrides: Record<string, any> = {}) {
    return {
      courier: {
        create: jest
          .fn()
          .mockResolvedValue({ id: "c1", userId: "u1", vehicleType: "CAR" }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({ id: "c1" }),
        ...overrides
      }
    } as any;
  }

  it("create creates a courier record", async () => {
    const prisma = buildPrisma();
    const service = new CouriersService(prisma);

    const result = await service.create({ userId: "u1", vehicleType: "CAR" });

    expect(prisma.courier.create).toHaveBeenCalledWith({
      data: { userId: "u1", vehicleType: "CAR" }
    });
    expect(result).toEqual({ id: "c1", userId: "u1", vehicleType: "CAR" });
  });

  it("findAll returns couriers ordered by availability", async () => {
    const couriers = [
      { id: "c1", availability: true },
      { id: "c2", availability: false }
    ];
    const prisma = buildPrisma({
      findMany: jest.fn().mockResolvedValue(couriers)
    });
    const service = new CouriersService(prisma);

    const result = await service.findAll();

    expect(prisma.courier.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ availability: "desc" }, { createdAt: "desc" }]
      })
    );
    expect(result).toEqual(couriers);
  });

  it("findMe returns courier by userId", async () => {
    const courier = { id: "c1", userId: "u1", vehicleType: "BIKE" };
    const prisma = buildPrisma({
      findUnique: jest.fn().mockResolvedValue(courier)
    });
    const service = new CouriersService(prisma);

    const result = await service.findMe("u1");

    expect(prisma.courier.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "u1" } })
    );
    expect(result).toEqual(courier);
  });

  it("updateMyAvailability toggles availability", async () => {
    const updated = { id: "c1", availability: false };
    const prisma = buildPrisma({
      update: jest.fn().mockResolvedValue(updated)
    });
    const service = new CouriersService(prisma);

    const result = await service.updateMyAvailability("u1", {
      availability: false
    });

    expect(prisma.courier.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "u1" },
        data: { availability: false }
      })
    );
    expect(result).toEqual(updated);
  });

  it("updateMyProfile updates vehicle type", async () => {
    const updated = { id: "c1", vehicleType: "TRUCK" };
    const prisma = buildPrisma({
      update: jest.fn().mockResolvedValue(updated)
    });
    const service = new CouriersService(prisma);

    const result = await service.updateMyProfile("u1", {
      vehicleType: "TRUCK"
    });

    expect(prisma.courier.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "u1" },
        data: { vehicleType: "TRUCK" }
      })
    );
    expect(result).toEqual(updated);
  });

  it("getPerformance returns per-courier stats with completion rate", async () => {
    const prisma = buildPrisma({
      findMany: jest.fn().mockResolvedValue([
        {
          id: "c1",
          vehicleType: "CAR",
          availability: true,
          user: { id: "u1", email: "a@b.com" },
          shipments: [
            { status: "DELIVERED" },
            { status: "DELIVERED" },
            { status: "IN_TRANSIT" },
            { status: "CANCELLED" }
          ]
        }
      ])
    });
    const service = new CouriersService(prisma);

    const result = await service.getPerformance();

    expect(result).toEqual([
      {
        courierId: "c1",
        email: "a@b.com",
        vehicleType: "CAR",
        availability: true,
        totalShipments: 4,
        delivered: 2,
        inTransit: 1,
        cancelled: 1,
        completionRate: 50
      }
    ]);
  });

  it("getPerformance returns 0 completion rate when no shipments", async () => {
    const prisma = buildPrisma({
      findMany: jest.fn().mockResolvedValue([
        {
          id: "c1",
          vehicleType: "BIKE",
          availability: false,
          user: { id: "u1", email: "a@b.com" },
          shipments: []
        }
      ])
    });
    const service = new CouriersService(prisma);

    const result = await service.getPerformance();

    expect(result[0].completionRate).toBe(0);
    expect(result[0].totalShipments).toBe(0);
  });
});
