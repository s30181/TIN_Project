import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({ summary: 'Liveness check' })
  @Get('live')
  live() {
    return this.healthService.live();
  }

  @ApiOperation({ summary: 'Readiness check' })
  @Get('ready')
  ready() {
    return this.healthService.databaseWorks();
  }
}
