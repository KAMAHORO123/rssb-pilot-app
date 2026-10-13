import {
  Controller,
  Get,
  UseGuards,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
  Request
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
import { AuthUser } from "../auth/auth-user.type";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Patch(":id/role")
  updateRole(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleDto,
    @Request() req: { user: AuthUser }
  ) {
    return this.usersService.updateRole(id, dto.role, req.user.userId);
  }
}
