import { getStoredAuthUser } from "./auth";

beforeEach(() => {
  localStorage.clear();
});

describe("getStoredAuthUser", () => {
  it("returns null when no auth_user in localStorage", () => {
    expect(getStoredAuthUser()).toBeNull();
  });

  it("returns parsed user when valid JSON exists", () => {
    const user = { id: "u1", email: "a@b.com", role: "USER" };
    localStorage.setItem("auth_user", JSON.stringify(user));

    expect(getStoredAuthUser()).toEqual(user);
  });

  it("returns null when auth_user contains invalid JSON", () => {
    localStorage.setItem("auth_user", "not-json");

    expect(getStoredAuthUser()).toBeNull();
  });
});
