import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { AppConfigModule } from './config/app-config.module';

import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AppConfigModule,
    HealthModule,
    UsersModule,
    ReservationsModule,
    AuthModule,
  ],
})
export class AppModule { }
