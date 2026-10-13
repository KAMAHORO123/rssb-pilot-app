import { NotFoundException } from "@nestjs/common";
import { TrackingGateway } from "./tracking.gateway";

describe("TrackingGateway", () => {
  function buildGateway(shipmentsOverride: any = {}, jwtOverride: any = {}) {
    const shipmentsService = {
      findOne: jest.fn().mockResolvedValue({ id: "s1" }),
      ...shipmentsOverride
    } as any;
    const jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({
        sub: "u1",
        email: "a@b.com",
        role: "USER"
      }),
      ...jwtOverride
    } as any;

    const gateway = new TrackingGateway(shipmentsService, jwtService);
    gateway.server = {
      to: jest.fn().mockReturnValue({ emit: jest.fn() })
    } as any;

    return { gateway, shipmentsService, jwtService };
  }

  function buildClient(overrides: Partial<any> = {}) {
    return {
      handshake: { auth: { token: "valid-token" } },
      data: {},
      disconnect: jest.fn(),
      join: jest.fn(),
      leave: jest.fn(),
      ...overrides
    } as any;
  }

  describe("handleConnection", () => {
    it("authenticates client with valid token", async () => {
      const { gateway, jwtService } = buildGateway();
      const client = buildClient();

      await gateway.handleConnection(client);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith("valid-token");
      expect(client.data.user).toEqual({
        userId: "u1",
        email: "a@b.com",
        role: "USER"
      });
      expect(client.disconnect).not.toHaveBeenCalled();
    });

    it("disconnects client with no token", async () => {
      const { gateway } = buildGateway();
      const client = buildClient({
        handshake: { auth: {} }
      });

      await gateway.handleConnection(client);

      expect(client.disconnect).toHaveBeenCalledWith(true);
    });

    it("disconnects client with invalid token", async () => {
      const { gateway } = buildGateway(
        {},
        { verifyAsync: jest.fn().mockRejectedValue(new Error("Invalid")) }
      );
      const client = buildClient();

      await gateway.handleConnection(client);

      expect(client.disconnect).toHaveBeenCalledWith(true);
    });
  });

  describe("joinShipmentRoom", () => {
    it("joins room when user has access", async () => {
      const { gateway } = buildGateway();
      const client = buildClient();
      client.data.user = { userId: "u1", email: "a@b.com", role: "USER" };

      await gateway.joinShipmentRoom({ shipmentId: "s1" }, client);

      expect(client.join).toHaveBeenCalledWith("shipment:s1");
    });

    it("disconnects unauthenticated client", async () => {
      const { gateway } = buildGateway();
      const client = buildClient();

      await gateway.joinShipmentRoom({ shipmentId: "s1" }, client);

      expect(client.disconnect).toHaveBeenCalledWith(true);
      expect(client.join).not.toHaveBeenCalled();
    });

    it("does not join room when access is denied", async () => {
      const { gateway } = buildGateway({
        findOne: jest.fn().mockRejectedValue(new NotFoundException())
      });
      const client = buildClient();
      client.data.user = { userId: "u1", email: "a@b.com", role: "USER" };

      await gateway.joinShipmentRoom({ shipmentId: "s1" }, client);

      expect(client.join).not.toHaveBeenCalled();
    });
  });

  describe("leaveShipmentRoom", () => {
    it("leaves the room", async () => {
      const { gateway } = buildGateway();
      const client = buildClient();

      await gateway.leaveShipmentRoom({ shipmentId: "s1" }, client);

      expect(client.leave).toHaveBeenCalledWith("shipment:s1");
    });
  });

  describe("emitShipmentUpdate", () => {
    it("emits event to the correct room", () => {
      const { gateway } = buildGateway();
      const payload = {
        shipmentId: "s1",
        status: "IN_TRANSIT",
        locationLat: 40.0,
        locationLng: 29.0
      };

      gateway.emitShipmentUpdate(payload);

      expect(gateway.server.to).toHaveBeenCalledWith("shipment:s1");
    });
  });
});
