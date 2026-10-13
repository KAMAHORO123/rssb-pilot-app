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
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ChangeEmailDto } from "./dto/change-email.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthUser } from "./auth-user.type";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("refresh")
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @Post("logout")
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refresh_token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@Request() req: { user: AuthUser }) {
    return this.authService.getMe(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("change-password")
  changePassword(
    @Body() dto: ChangePasswordDto,
    @Request() req: { user: AuthUser }
  ) {
    return this.authService.changePassword(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("change-email")
  changeEmail(@Body() dto: ChangeEmailDto, @Request() req: { user: AuthUser }) {
    return this.authService.changeEmail(req.user.userId, dto);
  }
}
