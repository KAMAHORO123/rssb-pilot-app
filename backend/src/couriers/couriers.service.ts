import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCourierDto } from "./dto/create-courier.dto";
import { UpdateMyAvailabilityDto } from "./dto/update-my-availability.dto";
import { UpdateCourierProfileDto } from "./dto/update-courier-profile.dto";

@Injectable()
export class CouriersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourierDto) {
    return this.prisma.courier.create({
      data: {
        userId: dto.userId,
        vehicleType: dto.vehicleType
      }
    });
  }

  async findAll() {
    return this.prisma.courier.findMany({
      orderBy: [{ availability: "desc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: {
            shipments: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });
  }

  async updateMyAvailability(userId: string, dto: UpdateMyAvailabilityDto) {
    return this.prisma.courier.update({
      where: { userId },
      data: {
        availability: dto.availability
      },
      include: {
        _count: {
          select: {
            shipments: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });
  }

  async findMe(userId: string) {
    const courier = await this.prisma.courier.findUnique({
      where: { userId },
      include: {
        _count: {
          select: {
            shipments: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });

    if (!courier) {
      throw new NotFoundException("Courier profile not found");
    }

    return courier;
  }

  async updateMyProfile(userId: string, dto: UpdateCourierProfileDto) {
    return this.prisma.courier.update({
      where: { userId },
      data: {
        vehicleType: dto.vehicleType
      },
      include: {
        _count: {
          select: {
            shipments: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });
  }

  async getPerformance() {
    const couriers = await this.prisma.courier.findMany({
      include: {
        user: {
          select: { id: true, email: true }
        },
        shipments: {
          select: { status: true }
        }
      }
    });

    return couriers.map((courier) => {
      const total = courier.shipments.length;
      const delivered = courier.shipments.filter(
        (s) => s.status === "DELIVERED"
      ).length;
      const inTransit = courier.shipments.filter(
        (s) => s.status === "IN_TRANSIT"
      ).length;
      const cancelled = courier.shipments.filter(
        (s) => s.status === "CANCELLED"
      ).length;

      return {
        courierId: courier.id,
        email: courier.user.email,
        vehicleType: courier.vehicleType,
        availability: courier.availability,
        totalShipments: total,
        delivered,
        inTransit,
        cancelled,
        completionRate: total > 0 ? Math.round((delivered / total) * 100) : 0
      };
    });
  }
}
