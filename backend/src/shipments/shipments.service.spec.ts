import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ShipmentsService } from "./shipments.service";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";

describe("ShipmentsService", () => {
  it("findAll returns paginated shipments for ADMIN", async () => {
    const prisma = {
      shipment: {
        findMany: jest.fn().mockResolvedValue([{ id: "s1" }]),
        count: jest.fn().mockResolvedValue(1)
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    const result = await service.findAll({ userId: "u1", role: "ADMIN" }, {});

    expect(prisma.shipment.findMany).toHaveBeenCalled();
    expect(prisma.shipment.count).toHaveBeenCalled();
    expect(result).toEqual({
      data: [{ id: "s1" }],
      meta: { total: 1, page: 1, limit: 20, totalPages: 1 }
    });
  });

  it("findAll returns paginated courier assigned shipments for COURIER", async () => {
    const prisma = {
      courier: {
        findUnique: jest.fn().mockResolvedValue({ id: "c1", userId: "u1" })
      },
      shipment: {
        findMany: jest.fn().mockResolvedValue([{ id: "s1" }]),
        count: jest.fn().mockResolvedValue(1)
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    const result = await service.findAll({ userId: "u1", role: "COURIER" }, {});

    expect(prisma.courier.findUnique).toHaveBeenCalledWith({
      where: { userId: "u1" }
    });
    expect(prisma.shipment.findMany).toHaveBeenCalled();
    expect(result.data).toEqual([{ id: "s1" }]);
    expect(result.meta.total).toBe(1);
  });

  it("findAll returns empty result for COURIER when courier record is missing", async () => {
    const prisma = {
      courier: {
        findUnique: jest.fn().mockResolvedValue(null)
      },
      shipment: {
        findMany: jest.fn()
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    const result = await service.findAll({ userId: "u1", role: "COURIER" }, {});
    expect(result.data).toEqual([]);
    expect(result.meta.total).toBe(0);
    expect(prisma.shipment.findMany).not.toHaveBeenCalled();
  });

  it("findOne allows USER to access their own shipment", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({ id: "s1", createdById: "u1" })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({
        id: "s1",
        createdById: "u1"
      })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    const result = await service.findOne("s1", { userId: "u1", role: "USER" });
    expect(result).toEqual({ id: "s1", createdById: "u1" });
  });

  it("findOne denies USER when shipment is not created by them", async () => {
    const prisma = {
      shipment: {}
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest
        .fn()
        .mockRejectedValue(new NotFoundException("Shipment Not Found"))
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    await expect(
      service.findOne("s1", { userId: "u1", role: "USER" })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("findOne allows COURIER to access assigned shipment", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({
          id: "s1",
          createdById: "u2",
          assignedCourierId: "c1"
        })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({
        id: "s1",
        createdById: "u2",
        assignedCourierId: "c1"
      })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    const result = await service.findOne("s1", {
      userId: "u1",
      role: "COURIER"
    });
    expect(result).toEqual({
      id: "s1",
      createdById: "u2",
      assignedCourierId: "c1"
    });
  });

  it("update updates shipments for ADMIN", async () => {
    const prisma = {
      shipment: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: "s1", status: "CREATED" }),
        update: jest.fn().mockResolvedValue({ id: "s1" })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );
    const dto: UpdateShipmentDto = {
      title: "Updated",
      pickupAddress: "A1",
      deliveryAddress: "B1"
    } as any;

    await service.update("s1", dto, { userId: "admin", role: "ADMIN" } as any);

    expect(prisma.shipment.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: {
        title: dto.title,
        description: dto.description,
        pickupAddress: dto.pickupAddress,
        deliveryAddress: dto.deliveryAddress
      }
    });
  });

  it("assignCourier sets assignedCourierId and status ASSIGNED", async () => {
    const prisma = {
      shipment: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: "s1", status: "CREATED" }),
        update: jest.fn().mockResolvedValue({ id: "s1" })
      },
      courier: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: "c1", userId: "u1", availability: true })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );
    await service.assignCourier("s1", "c1", "admin");

    expect(prisma.shipment.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { assignedCourierId: "c1", status: "ASSIGNED" }
    });
  });

  it("assignCourier throws when courier does not exist", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({ id: "s1" }),
        update: jest.fn()
      },
      courier: {
        findUnique: jest.fn().mockResolvedValue(null)
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    await expect(
      service.assignCourier("s1", "missing", "admin")
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("update rejects edits when shipment is not in CREATED status", async () => {
    const prisma = {
      shipment: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: "s1", status: "ASSIGNED" }),
        update: jest.fn()
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    await expect(
      service.update(
        "s1",
        {
          title: "Updated"
        } as any,
        { userId: "u1", role: "USER" } as any
      )
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("cancel clears assignment and marks shipment as CANCELLED", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({
          id: "s1",
          status: "ASSIGNED",
          createdById: "u1",
          assignedCourierId: "c1"
        }),
        update: jest.fn().mockResolvedValue({
          id: "s1",
          status: "CANCELLED",
          assignedCourierId: null
        })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    const result = await service.cancel("s1", {
      userId: "u1",
      role: "USER"
    } as any);

    expect(prisma.shipment.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: {
        status: "CANCELLED",
        assignedCourierId: null
      }
    });
    expect(result).toEqual({
      id: "s1",
      status: "CANCELLED",
      assignedCourierId: null
    });
  });

  it("cancel rejects non-cancellable shipment statuses", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({
          id: "s1",
          status: "IN_TRANSIT",
          createdById: "u1",
          assignedCourierId: "c1"
        }),
        update: jest.fn()
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    await expect(
      service.cancel("s1", {
        userId: "u1",
        role: "USER"
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("getMetrics returns counts grouped by status", async () => {
    const prisma = {
      shipment: {
        groupBy: jest.fn().mockResolvedValue([
          { status: "CREATED", _count: 3 },
          { status: "DELIVERED", _count: 5 },
          { status: "IN_TRANSIT", _count: 2 }
        ])
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {} as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    const result = await service.getMetrics();

    expect(result).toEqual({
      total: 10,
      delivered: 5,
      pickedUp: 0,
      inTransit: 2,
      assigned: 0,
      created: 3,
      cancelled: 0
    });
  });

  it("getAnalytics returns delivery stats and trends", async () => {
    const now = new Date("2026-03-22T12:00:00Z");
    const created = new Date("2026-03-22T00:00:00Z");
    const prisma = {
      shipment: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ createdAt: created, updatedAt: now }]),
        groupBy: jest
          .fn()
          .mockResolvedValueOnce([{ createdAt: now, _count: 1 }])
          .mockResolvedValueOnce([
            { deliveryAddress: "123 Main St", _count: 3 }
          ])
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {} as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    const result = await service.getAnalytics();

    expect(result.totalDelivered).toBe(1);
    expect(result.avgDeliveryTimeHours).toBeGreaterThan(0);
    expect(result.dailyTrend).toHaveLength(1);
    expect(result.topDeliveryAddresses).toEqual([
      { address: "123 Main St", count: 3 }
    ]);
  });

  it("remove deletes a CANCELLED shipment and its tracking events", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({
          id: "s1",
          status: "CANCELLED",
          title: "Test"
        }),
        delete: jest.fn().mockResolvedValue({ id: "s1" })
      },
      trackingEvent: {
        deleteMany: jest.fn().mockResolvedValue({ count: 2 })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {} as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    const result = await service.remove("s1", "admin1");

    expect(prisma.trackingEvent.deleteMany).toHaveBeenCalledWith({
      where: { shipmentId: "s1" }
    });
    expect(prisma.shipment.delete).toHaveBeenCalledWith({
      where: { id: "s1" }
    });
    expect(auditService.log).toHaveBeenCalledWith(
      expect.objectContaining({
        actionType: "SHIPMENT_DELETED",
        targetId: "s1"
      })
    );
    expect(result).toEqual({ message: "Shipment deleted successfully" });
  });

  it("remove rejects non-CANCELLED shipments", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({
          id: "s1",
          status: "ASSIGNED"
        })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {} as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    await expect(service.remove("s1", "admin1")).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it("delay transitions IN_TRANSIT shipment to DELAYED", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({
          id: "s1",
          status: "IN_TRANSIT"
        }),
        update: jest.fn().mockResolvedValue({
          id: "s1",
          status: "DELAYED"
        })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {} as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    const result = await service.delay("s1", { note: "Traffic jam" }, "admin1");

    expect(prisma.shipment.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { status: "DELAYED" }
    });
    expect(auditService.log).toHaveBeenCalledWith(
      expect.objectContaining({
        actionType: "SHIPMENT_DELAYED",
        metadata: { note: "Traffic jam" }
      })
    );
    expect(result.status).toBe("DELAYED");
  });

  it("delay rejects non-IN_TRANSIT shipments", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({
          id: "s1",
          status: "CREATED"
        })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {} as any;
    const service = new ShipmentsService(
      prisma,
      auditService,
      accessControlService
    );

    await expect(
      service.delay("s1", { note: "Test" }, "admin1")
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
