import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ChangeEmailDto } from "./dto/change-email.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes } from "crypto";

const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const BCRYPT_SALT_ROUNDS = 10;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService
  ) {}

  private async generateRefreshToken(userId: string): Promise<string> {
    const rawToken = randomBytes(40).toString("hex");
    const hashedToken = hashToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await this.prisma.refreshToken.create({
      data: { token: hashedToken, userId, expiresAt }
    });

    return rawToken;
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: "USER"
      }
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (!user) {
      await this.auditService.log({
        actionType: "LOGIN_FAILED",
        targetType: "Auth",
        metadata: { email: dto.email, reason: "user_not_found" }
      });
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordOk = await bcrypt.compare(dto.password, user.password);
    if (!passwordOk) {
      await this.auditService.log({
        actorUserId: user.id,
        actionType: "LOGIN_FAILED",
        targetType: "Auth",
        metadata: { email: dto.email, reason: "wrong_password" }
      });
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.generateRefreshToken(user.id)
    ]);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  async refresh(refreshToken: string) {
    const hashed = hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: hashed },
      include: { user: true }
    });

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) {
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      }
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    // Token rotation: delete old token, issue new pair
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    const user = stored.user;
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    const [access_token, new_refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.generateRefreshToken(user.id)
    ]);

    return {
      access_token,
      refresh_token: new_refresh_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  async logout(refreshToken: string) {
    const hashed = hashToken(refreshToken);
    await this.prisma.refreshToken
      .delete({ where: { token: hashed } })
      .catch(() => {
        // Token may already be deleted or invalid — ignore
      });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordOk = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordOk) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      BCRYPT_SALT_ROUNDS
    );
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Invalidate all refresh tokens for this user
    await this.prisma.refreshToken.deleteMany({
      where: { userId }
    });

    return { message: "Password changed successfully" };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        courier: {
          select: {
            id: true,
            vehicleType: true,
            availability: true
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }

  async changeEmail(userId: string, dto: ChangeEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordOk = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordOk) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.newEmail }
    });

    if (existing) {
      throw new ConflictException("Email already in use");
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { email: dto.newEmail }
    });

    await this.prisma.refreshToken.deleteMany({
      where: { userId }
    });

    await this.auditService.log({
      actorUserId: userId,
      actionType: "EMAIL_CHANGED",
      targetType: "User",
      targetId: userId,
      metadata: { previousEmail: user.email, newEmail: dto.newEmail }
    });

    return { message: "Email changed successfully. Please log in again." };
  }
}
