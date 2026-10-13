import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  Request
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TrackingService } from "./tracking.service";
import { CreateTrackingDto } from "./dto/create-tracking.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AuthUser } from "../auth/auth-user.type";

@ApiTags("Tracking")
@ApiBearerAuth()
@Controller("shipments")
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("COURIER", "ADMIN")
  @Post(":id/tracking")
  create(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: CreateTrackingDto,
    @Request() req: { user: AuthUser }
  ) {
    return this.trackingService.create(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id/tracking")
  findByShipment(
    @Param("id", ParseUUIDPipe) id: string,
    @Request() req: { user: AuthUser }
  ) {
    return this.trackingService.findByShipment(id, req.user);
  }
}
