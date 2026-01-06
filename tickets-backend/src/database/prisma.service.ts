import { Injectable } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly appConfigService: AppConfigService) {
    const adapter = new PrismaBetterSqlite3({
      url: appConfigService.sqliteUrl,
    });
    super({ adapter });
  }
}
