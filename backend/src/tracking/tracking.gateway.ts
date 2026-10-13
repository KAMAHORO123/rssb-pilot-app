import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Server, Socket } from "socket.io";
import { ShipmentsService } from "../shipments/shipments.service";

@WebSocketGateway({
  cors: {
    origin:
      process.env.ALLOWED_ORIGINS?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [],
    credentials: true
  }
})
export class TrackingGateway implements OnGatewayConnection {
  private readonly logger = new Logger(TrackingGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly shipmentsService: ShipmentsService,
    private readonly jwtService: JwtService
  ) {}

  private shipmentRoom(shipmentId: string) {
    return `shipment:${shipmentId}`;
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token || typeof token !== "string") {
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        role: string;
      }>(token);

      client.data.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role
      };
    } catch {
      this.logger.warn("Socket auth failed, disconnecting client.");
      client.disconnect(true);
    }
  }

  @SubscribeMessage("joinShipmentRoom")
  async joinShipmentRoom(
    @MessageBody() data: { shipmentId: string },
    @ConnectedSocket() client: Socket
  ) {
    const user = client.data.user as
      | { userId: string; email: string; role: string }
      | undefined;

    if (!user) {
      client.disconnect(true);
      return;
    }

    try {
      await this.shipmentsService.findOne(data.shipmentId, user);
      client.join(this.shipmentRoom(data.shipmentId));
    } catch {
      // Access denied: do not join the room.
    }
  }

  @SubscribeMessage("leaveShipmentRoom")
  async leaveShipmentRoom(
    @MessageBody() data: { shipmentId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.leave(this.shipmentRoom(data.shipmentId));
  }

  emitShipmentUpdate(payload: {
    shipmentId: string;
    status: string;
    locationLat?: number;
    locationLng?: number;
    note?: string;
    createdAt?: Date;
  }) {
    this.server
      .to(this.shipmentRoom(payload.shipmentId))
      .emit("shipment-status-update", payload);
  }
}
