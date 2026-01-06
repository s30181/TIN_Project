import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsPort, IsString, validateSync } from 'class-validator';

export enum Environment {
  DEVELOPMENT = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsPort()
  APP_PORT: string;

  @IsString()
  FRONTEND_URL: string;

  @IsString()
  SQLITE_URL: string;

  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsInt()
  JWT_ACCESS_EXPIRATION_TIME_SECONDS: number;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
