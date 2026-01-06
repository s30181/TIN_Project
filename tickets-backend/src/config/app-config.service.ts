import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';

@Injectable()
export class AppConfigService {
  constructor(private config: ConfigService<EnvironmentVariables, true>) {}

  get sqliteUrl() {
    return this.config.get('SQLITE_URL', { infer: true });
  }

  get jwtAccessSecret() {
    return this.config.get('JWT_ACCESS_SECRET', { infer: true });
  }

  get jwtAccessExpirationTime() {
    return this.config.get('JWT_ACCESS_EXPIRATION_TIME_SECONDS', {
      infer: true,
    });
  }

  get port() {
    return this.config.get('APP_PORT', { infer: true });
  }

  get frontendUrl() {
    return this.config.get('FRONTEND_URL', { infer: true });
  }

  get environment() {
    return this.config.get('NODE_ENV', { infer: true });
  }
}
