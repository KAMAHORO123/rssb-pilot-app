import { redirectToLoginIfUnauthorized } from "./route-guards";

beforeEach(() => {
  localStorage.clear();
});

function mockRouter() {
  return { push: jest.fn() };
}

describe("redirectToLoginIfUnauthorized", () => {
  it("returns false and redirects when no token", () => {
    const router = mockRouter();

    const result = redirectToLoginIfUnauthorized(router);

    expect(result).toBe(false);
    expect(router.push).toHaveBeenCalledWith("/login");
  });

  it("returns false and redirects when no auth_user", () => {
    localStorage.setItem("access_token", "tok");
    const router = mockRouter();

    const result = redirectToLoginIfUnauthorized(router);

    expect(result).toBe(false);
    expect(router.push).toHaveBeenCalledWith("/login");
  });

  it("returns true when token and user exist", () => {
    localStorage.setItem("access_token", "tok");
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: "u1", email: "a@b.com", role: "USER" })
    );
    const router = mockRouter();

    const result = redirectToLoginIfUnauthorized(router);

    expect(result).toBe(true);
    expect(router.push).not.toHaveBeenCalled();
  });

  it("returns false when user role does not match required roles", () => {
    localStorage.setItem("access_token", "tok");
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: "u1", email: "a@b.com", role: "USER" })
    );
    const router = mockRouter();

    const result = redirectToLoginIfUnauthorized(router, ["ADMIN"]);

    expect(result).toBe(false);
    expect(router.push).toHaveBeenCalledWith("/login");
  });

  it("returns true when user role matches required roles", () => {
    localStorage.setItem("access_token", "tok");
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: "u1", email: "a@b.com", role: "ADMIN" })
    );
    const router = mockRouter();

    const result = redirectToLoginIfUnauthorized(router, ["ADMIN"]);

    expect(result).toBe(true);
    expect(router.push).not.toHaveBeenCalled();
  });

  it("returns true when requiredRoles is empty array", () => {
    localStorage.setItem("access_token", "tok");
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: "u1", email: "a@b.com", role: "USER" })
    );
    const router = mockRouter();

    const result = redirectToLoginIfUnauthorized(router, []);

    expect(result).toBe(true);
    expect(router.push).not.toHaveBeenCalled();
  });
});
