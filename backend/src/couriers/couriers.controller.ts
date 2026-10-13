import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CouriersService } from "./couriers.service";
import { CreateCourierDto } from "./dto/create-courier.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { UpdateMyAvailabilityDto } from "./dto/update-my-availability.dto";
import { UpdateCourierProfileDto } from "./dto/update-courier-profile.dto";
import { AuthUser } from "../auth/auth-user.type";

@ApiTags("Couriers")
@ApiBearerAuth()
@Controller("couriers")
export class CouriersController {
  constructor(private readonly couriersService: CouriersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  create(@Body() dto: CreateCourierDto) {
    return this.couriersService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.couriersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("COURIER")
  @Get("me")
  findMe(@Request() req: { user: AuthUser }) {
    return this.couriersService.findMe(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("COURIER")
  @Patch("me/availability")
  updateMyAvailability(
    @Body() dto: UpdateMyAvailabilityDto,
    @Request() req: { user: AuthUser }
  ) {
    return this.couriersService.updateMyAvailability(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("COURIER")
  @Patch("me/profile")
  updateMyProfile(
    @Body() dto: UpdateCourierProfileDto,
    @Request() req: { user: AuthUser }
  ) {
    return this.couriersService.updateMyProfile(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("performance")
  getPerformance() {
    return this.couriersService.getPerformance();
  }
}
