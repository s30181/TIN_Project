import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { AppConfigModule } from './config/app-config.module';

import { UsersModule } from './modules/users/users.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    PrismaModule,
    AppConfigModule,
    UsersModule,
    ReservationsModule,
    AuthModule,
    EventsModule,
  ],
})
export class AppModule { }
