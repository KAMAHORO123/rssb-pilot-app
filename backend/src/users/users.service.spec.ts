import { NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  function buildPrisma(overrides: Record<string, any> = {}) {
    return {
      user: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({ id: "u1" }),
        ...overrides
      },
      courier: {
        create: jest.fn().mockResolvedValue({ id: "c1" })
      }
    } as any;
  }

  function buildAudit() {
    return { log: jest.fn().mockResolvedValue(undefined) } as any;
  }

  it("findAll returns users ordered by createdAt desc", async () => {
    const users = [{ id: "u1" }, { id: "u2" }];
    const prisma = buildPrisma({
      findMany: jest.fn().mockResolvedValue(users)
    });
    const service = new UsersService(prisma, buildAudit());

    const result = await service.findAll();

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" }
      })
    );
    expect(result).toEqual(users);
  });

  it("updateRole throws NotFoundException when user does not exist", async () => {
    const prisma = buildPrisma({
      findUnique: jest.fn().mockResolvedValue(null)
    });
    const service = new UsersService(prisma, buildAudit());

    await expect(
      service.updateRole("missing", "ADMIN", "actor1")
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("updateRole updates user role and logs audit event", async () => {
    const existingUser = {
      id: "u1",
      role: "USER",
      courier: null
    };
    const updatedUser = { id: "u1", role: "ADMIN" };
    const prisma = buildPrisma({
      findUnique: jest
        .fn()
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser),
      update: jest.fn().mockResolvedValue(updatedUser)
    });
    const audit = buildAudit();
    const service = new UsersService(prisma, audit);

    const result = await service.updateRole("u1", "ADMIN", "actor1");

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { role: "ADMIN" }
    });
    expect(audit.log).toHaveBeenCalledWith(
      expect.objectContaining({
        actorUserId: "actor1",
        actionType: "USER_ROLE_UPDATED",
        targetId: "u1",
        metadata: { fromRole: "USER", toRole: "ADMIN" }
      })
    );
    expect(result).toEqual(updatedUser);
  });

  it("updateRole auto-creates courier record when transitioning to COURIER", async () => {
    const existingUser = {
      id: "u1",
      role: "USER",
      courier: null
    };
    const updatedUser = { id: "u1", role: "COURIER" };
    const prisma = buildPrisma({
      findUnique: jest
        .fn()
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser),
      update: jest.fn().mockResolvedValue(updatedUser)
    });
    const audit = buildAudit();
    const service = new UsersService(prisma, audit);

    await service.updateRole("u1", "COURIER", "actor1");

    expect(prisma.courier.create).toHaveBeenCalledWith({
      data: { userId: "u1" }
    });
  });

  it("updateRole does not create duplicate courier record if one exists", async () => {
    const existingUser = {
      id: "u1",
      role: "ADMIN",
      courier: { id: "c1" }
    };
    const updatedUser = { id: "u1", role: "COURIER" };
    const prisma = buildPrisma({
      findUnique: jest
        .fn()
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser),
      update: jest.fn().mockResolvedValue(updatedUser)
    });
    const service = new UsersService(prisma, buildAudit());

    await service.updateRole("u1", "COURIER", "actor1");

    expect(prisma.courier.create).not.toHaveBeenCalled();
  });
});
