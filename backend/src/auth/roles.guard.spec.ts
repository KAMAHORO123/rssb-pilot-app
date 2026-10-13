import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";

function createExecutionContextWithUser(user: { role: string } | undefined) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        user
      })
    }),
    getHandler: () => ({}),
    getClass: () => ({})
  } as unknown as ExecutionContext;
}

describe("RolesGuard", () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it("allows when no required roles metadata is set", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue(undefined as unknown as string[]);

    const ctx = createExecutionContextWithUser({ role: "ADMIN" });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("denies when required roles exist but request.user is missing", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["ADMIN"]);

    const ctx = createExecutionContextWithUser(undefined);
    expect(guard.canActivate(ctx)).toBe(false);
  });

  it("allows when user role matches one of the required roles", () => {
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue(["ADMIN", "COURIER"]);

    const ctx = createExecutionContextWithUser({ role: "COURIER" });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("denies when user role does not match", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["ADMIN"]);

    const ctx = createExecutionContextWithUser({ role: "USER" });
    expect(guard.canActivate(ctx)).toBe(false);
  });
});
