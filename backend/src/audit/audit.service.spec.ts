import { AuditService } from "./audit.service";

describe("AuditService", () => {
  function buildPrisma(overrides: Record<string, any> = {}) {
    return {
      auditLog: {
        create: jest.fn().mockResolvedValue({ id: "a1" }),
        findMany: jest.fn().mockResolvedValue([]),
        ...overrides
      }
    } as any;
  }

  it("log creates an audit log entry", async () => {
    const prisma = buildPrisma();
    const service = new AuditService(prisma);

    await service.log({
      actorUserId: "u1",
      actionType: "SHIPMENT_CANCELLED",
      targetType: "Shipment",
      targetId: "s1",
      metadata: { previousStatus: "ASSIGNED" }
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        actorUserId: "u1",
        actionType: "SHIPMENT_CANCELLED",
        targetType: "Shipment",
        targetId: "s1",
        metadata: { previousStatus: "ASSIGNED" }
      }
    });
  });

  it("log handles undefined metadata", async () => {
    const prisma = buildPrisma();
    const service = new AuditService(prisma);

    await service.log({
      actorUserId: "u1",
      actionType: "LOGIN_FAILED",
      targetType: "Auth"
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        actorUserId: "u1",
        actionType: "LOGIN_FAILED",
        targetType: "Auth",
        targetId: undefined,
        metadata: undefined
      }
    });
  });

  it("log strips undefined values from metadata", async () => {
    const prisma = buildPrisma();
    const service = new AuditService(prisma);

    await service.log({
      actorUserId: "u1",
      actionType: "TEST",
      targetType: "Test",
      metadata: { keep: "yes", drop: undefined }
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        metadata: { keep: "yes" }
      })
    });
  });

  it("findAll returns logs with default desc ordering", async () => {
    const logs = [{ id: "a1" }, { id: "a2" }];
    const prisma = buildPrisma({
      findMany: jest.fn().mockResolvedValue(logs)
    });
    const service = new AuditService(prisma);

    const result = await service.findAll({});

    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" }
      })
    );
    expect(result).toEqual(logs);
  });

  it("findAll filters by actionType and targetType", async () => {
    const prisma = buildPrisma();
    const service = new AuditService(prisma);

    await service.findAll({
      actionType: "SHIPMENT_CANCELLED",
      targetType: "Shipment"
    });

    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          actionType: "SHIPMENT_CANCELLED",
          targetType: "Shipment"
        })
      })
    );
  });

  it("findAll respects asc sort order", async () => {
    const prisma = buildPrisma();
    const service = new AuditService(prisma);

    await service.findAll({ sortOrder: "asc" });

    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "asc" }
      })
    );
  });
});
