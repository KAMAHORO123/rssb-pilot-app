import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { AccessControlService } from "../auth/access-control.service";
import { CreateShipmentDto } from "./dto/create-shipment.dto";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";
import { DelayShipmentDto } from "./dto/delay-shipment.dto";
import { AuthUser } from "../auth/auth-user.type";
import { ListShipmentsQueryDto } from "./dto/list-shipments-query.dto";

const CANCELLABLE_SHIPMENT_STATUSES = new Set(["CREATED", "ASSIGNED"]);
const EDITABLE_SHIPMENT_STATUSES = new Set(["CREATED"]);

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly accessControlService: AccessControlService
  ) {}

  private async getShipmentOrThrow(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id }
    });

    if (!shipment) {
      throw new NotFoundException("Shipment Not Found");
    }

    return shipment;
  }

  private async getCourierByUserId(userId: string) {
    return this.prisma.courier.findUnique({
      where: { userId }
    });
  }

  private getShipmentInclude() {
    return {
      createdBy: {
        select: {
          id: true,
          email: true,
          role: true
        }
      },
      assignedCourier: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        }
      }
    } as const;
  }

  private buildAdminShipmentWhere(
    query: ListShipmentsQueryDto
  ): Prisma.ShipmentWhereInput {
    const andFilters: Prisma.ShipmentWhereInput[] = [];

    if (query.search) {
      andFilters.push({
        OR: [
          {
            title: {
              contains: query.search,
              mode: "insensitive"
            }
          },
          {
            pickupAddress: {
              contains: query.search,
              mode: "insensitive"
            }
          },
          {
            deliveryAddress: {
              contains: query.search,
              mode: "insensitive"
            }
          }
        ]
      });
    }

    if (query.status) {
      andFilters.push({
        status: query.status
      });
    }

    if (query.assignedCourierId) {
      andFilters.push({
        assignedCourierId: query.assignedCourierId
      });
    }

    return andFilters.length > 0 ? { AND: andFilters } : {};
  }

  async create(dto: CreateShipmentDto, createdById: string) {
    return this.prisma.shipment.create({
      data: {
        title: dto.title,
        description: dto.description,
        pickupAddress: dto.pickupAddress,
        deliveryAddress: dto.deliveryAddress,
        createdById
      }
    });
  }

  async findAll(
    user: { userId: string; role: string },
    query: ListShipmentsQueryDto
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    if (user.role === "ADMIN") {
      const where = this.buildAdminShipmentWhere(query);
      const orderBy: Prisma.ShipmentOrderByWithRelationInput = {
        [query.sortBy ?? "createdAt"]: query.sortOrder ?? "desc"
      };
      const [data, total] = await Promise.all([
        this.prisma.shipment.findMany({
          where,
          orderBy,
          include: this.getShipmentInclude(),
          skip,
          take: limit
        }),
        this.prisma.shipment.count({ where })
      ]);
      return {
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
      };
    }

    if (user.role === "COURIER") {
      const courier = await this.getCourierByUserId(user.userId);

      if (!courier) {
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
      }

      const where = { assignedCourierId: courier.id };
      const [data, total] = await Promise.all([
        this.prisma.shipment.findMany({
          where,
          orderBy: { createdAt: "desc" },
          include: this.getShipmentInclude(),
          skip,
          take: limit
        }),
        this.prisma.shipment.count({ where })
      ]);
      return {
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
      };
    }

    const where = { createdById: user.userId };
    const [data, total] = await Promise.all([
      this.prisma.shipment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: this.getShipmentInclude(),
        skip,
        take: limit
      }),
      this.prisma.shipment.count({ where })
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  async findOne(id: string, user: { userId: string; role: string }) {
    await this.accessControlService.assertShipmentAccess(id, user);

    return this.prisma.shipment.findUnique({
      where: { id },
      include: this.getShipmentInclude()
    });
  }

  async update(id: string, dto: UpdateShipmentDto, user: AuthUser) {
    const shipment = await this.getShipmentOrThrow(id);

    if (!EDITABLE_SHIPMENT_STATUSES.has(shipment.status)) {
      throw new BadRequestException(
        "Only shipments in CREATED status can be edited."
      );
    }

    const canEdit =
      user.role === "ADMIN" ||
      (user.role === "USER" && shipment.createdById === user.userId);

    if (!canEdit) {
      throw new NotFoundException("Shipment Not Found");
    }

    return this.prisma.shipment.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        pickupAddress: dto.pickupAddress,
        deliveryAddress: dto.deliveryAddress
      }
    });
  }

  async assignCourier(
    shipmentId: string,
    courierId: string,
    actorUserId: string
  ) {
    const shipment = await this.getShipmentOrThrow(shipmentId);
    const previousAssignedCourierId = shipment.assignedCourierId;

    const courier = await this.prisma.courier.findUnique({
      where: { id: courierId }
    });

    if (!courier) {
      throw new NotFoundException("Courier Not Found");
    }

    if (!courier.availability) {
      throw new BadRequestException("Selected courier is unavailable.");
    }

    if (!["CREATED", "ASSIGNED"].includes(shipment.status)) {
      throw new BadRequestException(
        "Courier assignment is only allowed for CREATED or ASSIGNED shipments."
      );
    }

    const updatedShipment = await this.prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        assignedCourierId: courierId,
        status: "ASSIGNED"
      }
    });

    await this.auditService.log({
      actorUserId,
      actionType: "SHIPMENT_ASSIGNED_COURIER",
      targetType: "Shipment",
      targetId: shipmentId,
      metadata: {
        courierId,
        previousAssignedCourierId
      }
    });

    return updatedShipment;
  }

  async cancel(id: string, user: AuthUser) {
    const shipment = await this.getShipmentOrThrow(id);

    if (user.role !== "ADMIN" && shipment.createdById !== user.userId) {
      throw new NotFoundException("Shipment Not Found");
    }

    if (!CANCELLABLE_SHIPMENT_STATUSES.has(shipment.status)) {
      throw new BadRequestException(
        "Only CREATED or ASSIGNED shipments can be cancelled."
      );
    }

    const cancelledShipment = await this.prisma.shipment.update({
      where: { id },
      data: {
        status: "CANCELLED",
        assignedCourierId: null
      }
    });

    await this.auditService.log({
      actorUserId: user.userId,
      actionType: "SHIPMENT_CANCELLED",
      targetType: "Shipment",
      targetId: id,
      metadata: {
        previousStatus: shipment.status,
        previousAssignedCourierId: shipment.assignedCourierId
      }
    });

    return cancelledShipment;
  }

  async getMetrics() {
    const groups = await this.prisma.shipment.groupBy({
      by: ["status"],
      _count: true
    });

    const countByStatus = Object.fromEntries(
      groups.map((g) => [g.status, g._count])
    );

    const total = groups.reduce((sum, g) => sum + g._count, 0);

    return {
      total,
      delivered: countByStatus["DELIVERED"] ?? 0,
      pickedUp: countByStatus["PICKED_UP"] ?? 0,
      inTransit: countByStatus["IN_TRANSIT"] ?? 0,
      assigned: countByStatus["ASSIGNED"] ?? 0,
      created: countByStatus["CREATED"] ?? 0,
      cancelled: countByStatus["CANCELLED"] ?? 0
    };
  }

  async getAnalytics() {
    const deliveredShipments = await this.prisma.shipment.findMany({
      where: { status: "DELIVERED" },
      select: { createdAt: true, updatedAt: true }
    });

    const deliveryTimes = deliveredShipments
      .map((s) => {
        const created = new Date(s.createdAt).getTime();
        const updated = new Date(s.updatedAt).getTime();
        return updated - created;
      })
      .filter((ms) => ms > 0);

    const avgDeliveryTimeMs =
      deliveryTimes.length > 0
        ? deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length
        : 0;

    const avgDeliveryTimeHours =
      Math.round((avgDeliveryTimeMs / 3600000) * 10) / 10;

    const shipmentsByDay = await this.prisma.shipment.groupBy({
      by: ["createdAt"],
      _count: true,
      orderBy: { createdAt: "desc" },
      take: 30
    });

    const dailyTrend = shipmentsByDay.map((entry) => ({
      date: new Date(entry.createdAt).toISOString().split("T")[0],
      count: entry._count
    }));

    const topAddresses = await this.prisma.shipment.groupBy({
      by: ["deliveryAddress"],
      _count: true,
      orderBy: { _count: { deliveryAddress: "desc" } },
      take: 5
    });

    return {
      avgDeliveryTimeHours,
      totalDelivered: deliveredShipments.length,
      dailyTrend,
      topDeliveryAddresses: topAddresses.map((a) => ({
        address: a.deliveryAddress,
        count: a._count
      }))
    };
  }

  async remove(id: string, actorUserId: string) {
    const shipment = await this.getShipmentOrThrow(id);

    if (shipment.status !== "CANCELLED") {
      throw new BadRequestException("Only CANCELLED shipments can be deleted.");
    }

    await this.prisma.trackingEvent.deleteMany({
      where: { shipmentId: id }
    });

    await this.prisma.shipment.delete({ where: { id } });

    await this.auditService.log({
      actorUserId,
      actionType: "SHIPMENT_DELETED",
      targetType: "Shipment",
      targetId: id,
      metadata: { title: shipment.title }
    });

    return { message: "Shipment deleted successfully" };
  }

  async delay(id: string, dto: DelayShipmentDto, actorUserId: string) {
    const shipment = await this.getShipmentOrThrow(id);

    if (shipment.status !== "IN_TRANSIT") {
      throw new BadRequestException(
        "Only IN_TRANSIT shipments can be marked as delayed."
      );
    }

    const updated = await this.prisma.shipment.update({
      where: { id },
      data: { status: "DELAYED" }
    });

    await this.auditService.log({
      actorUserId,
      actionType: "SHIPMENT_DELAYED",
      targetType: "Shipment",
      targetId: id,
      metadata: { note: dto.note }
    });

    return updated;
  }
}
