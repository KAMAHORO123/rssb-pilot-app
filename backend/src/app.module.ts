import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { CacheModule } from "@nestjs/cache-manager";
import { seconds, ThrottlerModule } from "@nestjs/throttler";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ShipmentsModule } from "./shipments/shipments.module";
import { CouriersModule } from "./couriers/couriers.module";
import { TrackingModule } from "./tracking/tracking.module";
import { UsersModule } from "./users/users.module";
import { AuditModule } from "./audit/audit.module";
import { HttpThrottlerGuard } from "./common/guards/http-throttler.guard";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: seconds(60),
        limit: 60
      }
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 100
    }),
    PrismaModule,
    AuthModule,
    ShipmentsModule,
    CouriersModule,
    TrackingModule,
    UsersModule,
    AuditModule
  ],
  controllers: [HealthController],
  providers: [
    // Restrict global throttling to HTTP requests so websocket tracking stays stable.
    { provide: APP_GUARD, useClass: HttpThrottlerGuard }
  ]
})
export class AppModule {}
