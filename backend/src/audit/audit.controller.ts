import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AuditService } from "./audit.service";
import { ListAuditLogsQueryDto } from "./dto/list-audit-logs-query.dto";

@ApiTags("Audit Logs")
@ApiBearerAuth()
@Controller("audit-logs")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll(@Query() query: ListAuditLogsQueryDto) {
    return this.auditService.findAll(query);
  }
}
