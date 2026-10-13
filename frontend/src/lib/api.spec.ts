import {
  fetchShipments,
  fetchShipmentById,
  createShipment,
  loginUser,
  registerUser
} from "./api";

const API_BASE = "http://localhost:3001";

let fetchMock: jest.Mock;

beforeEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
  localStorage.setItem("access_token", "test-token");
  fetchMock = jest.fn();
  global.fetch = fetchMock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

function mockFetch(body: unknown, ok = true, status = 200) {
  fetchMock.mockResolvedValue({
    ok,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body))
  } as Response);
  return fetchMock;
}

describe("loginUser", () => {
  it("sends POST to /auth/login and returns result", async () => {
    const response = {
      access_token: "tok",
      refresh_token: "ref",
      user: { id: "u1", email: "a@b.com", role: "USER" }
    };
    const spy = mockFetch(response);

    const result = await loginUser({ email: "a@b.com", password: "secret" });

    expect(spy).toHaveBeenCalledWith(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.com", password: "secret" })
    });
    expect(result).toEqual(response);
  });

  it("throws on failed login", async () => {
    mockFetch({ message: "Invalid credentials" }, false, 401);

    await expect(
      loginUser({ email: "a@b.com", password: "wrong" })
    ).rejects.toThrow("Invalid credentials");
  });
});

describe("registerUser", () => {
  it("sends POST to /auth/register", async () => {
    const response = { id: "u1", email: "a@b.com", role: "USER" };
    const spy = mockFetch(response);

    const result = await registerUser({
      email: "a@b.com",
      password: "secret"
    });

    expect(spy).toHaveBeenCalledWith(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.com", password: "secret" })
    });
    expect(result).toEqual(response);
  });
});

describe("fetchShipments", () => {
  it("sends GET to /shipments with auth header", async () => {
    const response = { data: [{ id: "s1" }], meta: { total: 1, page: 1 } };
    const spy = mockFetch(response);

    const result = await fetchShipments();

    expect(spy).toHaveBeenCalledWith(`${API_BASE}/shipments`, {
      headers: { Authorization: "Bearer test-token" }
    });
    expect(result).toEqual(response);
  });

  it("sends query params when filters provided", async () => {
    const response = { data: [], meta: { total: 0, page: 1 } };
    const spy = mockFetch(response);

    await fetchShipments({ status: "DELIVERED", limit: 10 });

    const calledUrl = spy.mock.calls[0][0] as string;
    expect(calledUrl).toContain("status=DELIVERED");
    expect(calledUrl).toContain("limit=10");
  });

  it("throws on error response", async () => {
    mockFetch({ message: "Forbidden" }, false, 403);

    await expect(fetchShipments()).rejects.toThrow();
  });
});

describe("fetchShipmentById", () => {
  it("sends GET to /shipments/:id", async () => {
    const shipment = { id: "s1", title: "Test", status: "CREATED" };
    const spy = mockFetch(shipment);

    const result = await fetchShipmentById("s1");

    expect(spy).toHaveBeenCalledWith(`${API_BASE}/shipments/s1`, {
      headers: { Authorization: "Bearer test-token" }
    });
    expect(result).toEqual(shipment);
  });
});

describe("createShipment", () => {
  it("sends POST to /shipments with body", async () => {
    const input = {
      title: "Test",
      pickupAddress: "A",
      deliveryAddress: "B"
    };
    const response = { id: "s1", ...input, status: "CREATED" };
    const spy = mockFetch(response);

    const result = await createShipment(input);

    expect(spy).toHaveBeenCalledWith(`${API_BASE}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token"
      },
      body: JSON.stringify(input)
    });
    expect(result).toEqual(response);
  });
});

describe("auth headers", () => {
  it("sends empty headers when no token in localStorage", async () => {
    localStorage.removeItem("access_token");
    const response = { data: [], meta: { total: 0 } };
    const spy = mockFetch(response);

    await fetchShipments();

    expect(spy).toHaveBeenCalledWith(`${API_BASE}/shipments`, {
      headers: {}
    });
  });
});
