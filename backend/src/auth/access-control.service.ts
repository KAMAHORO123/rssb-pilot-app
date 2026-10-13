import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AccessControlService {
  constructor(private readonly prisma: PrismaService) {}

  async assertShipmentAccess(
    shipmentId: string,
    user: { userId: string; role: string }
  ) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId }
    });

    if (!shipment) {
      throw new NotFoundException("Shipment Not Found");
    }

    if (user.role === "ADMIN") {
      return shipment;
    }

    if (user.role === "USER" && shipment.createdById === user.userId) {
      return shipment;
    }

    if (user.role === "COURIER") {
      const courier = await this.prisma.courier.findUnique({
        where: { userId: user.userId }
      });

      if (courier && shipment.assignedCourierId === courier.id) {
        return shipment;
      }
    }

    throw new NotFoundException("Shipment Not Found");
  }
}
