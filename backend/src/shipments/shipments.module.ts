import { Module } from "@nestjs/common";
import { ShipmentsController } from "./shipments.controller";
import { ShipmentsService } from "./shipments.service";
import { AuditModule } from "../audit/audit.module";
import { AccessControlModule } from "../auth/access-control.module";

@Module({
  imports: [AuditModule, AccessControlModule],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService]
})
export class ShipmentsModule {}
