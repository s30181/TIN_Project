import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './env.validation';

@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: ['.env', '.env.local'],
    }),
  ],
})
@Global()
export class AppConfigModule {}
