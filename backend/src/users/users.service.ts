import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { Role } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        courier: {
          include: {
            _count: {
              select: {
                shipments: true
              }
            }
          }
        }
      }
    });
  }

  async updateRole(userId: string, role: Role, actorUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        courier: {
          include: {
            _count: {
              select: {
                shipments: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    const fromRole = user.role;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role
      }
    });

    if (role === "COURIER" && !user.courier) {
      await this.prisma.courier.create({
        data: {
          userId: user.id
        }
      });
    }

    await this.auditService.log({
      actorUserId,
      actionType: "USER_ROLE_UPDATED",
      targetType: "User",
      targetId: userId,
      metadata: { fromRole, toRole: role }
    });

    return this.prisma.user.findUnique({
      where: { id: updatedUser.id },
      include: {
        courier: {
          include: {
            _count: {
              select: {
                shipments: true
              }
            }
          }
        }
      }
    });
  }
}
