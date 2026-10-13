import { ServiceUnavailableException } from "@nestjs/common";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  it("getHealth returns ok status", () => {
    const prisma = {} as any;
    const controller = new HealthController(prisma);

    expect(controller.getHealth()).toEqual({ status: "ok" });
  });

  it("readiness returns ok when database is reachable", async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ "?column?": 1 }])
    } as any;
    const controller = new HealthController(prisma);

    const result = await controller.readiness();

    expect(result).toEqual({ status: "ok" });
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it("readiness throws ServiceUnavailableException when database is down", async () => {
    const prisma = {
      $queryRaw: jest.fn().mockRejectedValue(new Error("Connection refused"))
    } as any;
    const controller = new HealthController(prisma);

    await expect(controller.readiness()).rejects.toBeInstanceOf(
      ServiceUnavailableException
    );
  });
});
