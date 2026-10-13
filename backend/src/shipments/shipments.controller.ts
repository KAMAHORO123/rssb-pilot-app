import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  UseGuards,
  UseInterceptors,
  Request
} from "@nestjs/common";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ShipmentsService } from "./shipments.service";
import { CreateShipmentDto } from "./dto/create-shipment.dto";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";
import { AssignCourierDto } from "./dto/assign-courier.dto";
import { DelayShipmentDto } from "./dto/delay-shipment.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AuthUser } from "../auth/auth-user.type";
import { ListShipmentsQueryDto } from "./dto/list-shipments-query.dto";

@ApiTags("Shipments")
@ApiBearerAuth()
@Controller("shipments")
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("USER", "ADMIN")
  @Post()
  create(@Body() dto: CreateShipmentDto, @Request() req: { user: AuthUser }) {
    return this.shipmentsService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("USER", "ADMIN", "COURIER")
  @Get()
  findAll(
    @Request() req: { user: AuthUser },
    @Query() query: ListShipmentsQueryDto
  ) {
    return this.shipmentsService.findAll(req.user, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get("metrics")
  getMetrics() {
    return this.shipmentsService.getMetrics();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000)
  @Get("analytics")
  getAnalytics() {
    return this.shipmentsService.getAnalytics();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("USER", "ADMIN", "COURIER")
  @Get(":id")
  findOne(
    @Param("id", ParseUUIDPipe) id: string,
    @Request() req: { user: AuthUser }
  ) {
    return this.shipmentsService.findOne(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("USER", "ADMIN")
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateShipmentDto,
    @Request() req: { user: AuthUser }
  ) {
    return this.shipmentsService.update(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post(":id/assign-courier")
  assignCourier(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: AssignCourierDto,
    @Request() req: { user: AuthUser }
  ) {
    return this.shipmentsService.assignCourier(
      id,
      dto.courierId,
      req.user.userId
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("USER", "ADMIN")
  @Post(":id/cancel")
  cancel(
    @Param("id", ParseUUIDPipe) id: string,
    @Request() req: { user: AuthUser }
  ) {
    return this.shipmentsService.cancel(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete(":id")
  remove(
    @Param("id", ParseUUIDPipe) id: string,
    @Request() req: { user: AuthUser }
  ) {
    return this.shipmentsService.remove(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post(":id/delay")
  delay(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: DelayShipmentDto,
    @Request() req: { user: AuthUser }
  ) {
    return this.shipmentsService.delay(id, dto, req.user.userId);
  }
}
