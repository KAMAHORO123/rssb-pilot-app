import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { ListAuditLogsQueryDto } from "./dto/list-audit-logs-query.dto";

type AuditLogInput = {
  actorUserId?: string;
  actionType: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

function toJsonObject(
  value: Record<string, unknown>
): Prisma.InputJsonObject | undefined {
  const entries = Object.entries(value).flatMap(([key, nestedValue]) => {
    const jsonValue = toJsonValue(nestedValue);
    return jsonValue === undefined ? [] : [[key, jsonValue] as const];
  });

  return entries.length > 0
    ? (Object.fromEntries(entries) as Prisma.InputJsonObject)
    : undefined;
}

function toJsonValue(value: unknown): Prisma.InputJsonValue | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(
      (item) => toJsonValue(item) ?? null
    ) as Prisma.InputJsonArray;
  }

  if (typeof value === "object") {
    return toJsonObject(value as Record<string, unknown>);
  }

  return String(value);
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: AuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        actionType: input.actionType,
        targetType: input.targetType,
        targetId: input.targetId,
        metadata: input.metadata ? toJsonObject(input.metadata) : undefined
      }
    });
  }

  async findAll(query: ListAuditLogsQueryDto) {
    const where: Prisma.AuditLogWhereInput = {
      actionType: query.actionType,
      targetType: query.targetType,
      actorUserId: query.actorUserId,
      targetId: query.targetId
    };

    return this.prisma.auditLog.findMany({
      where,
      orderBy: {
        createdAt: query.sortOrder === "asc" ? "asc" : "desc"
      },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });
  }
}
