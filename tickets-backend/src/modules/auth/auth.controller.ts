import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AppConfigService } from '../../config/app-config.service';
import { Environment } from '../../config/env.validation';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'login' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({})
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { user, accessToken } = await this.authService.login(loginDto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.environment === Environment.PRODUCTION,
      sameSite: 'lax',
      maxAge: this.configService.jwtAccessExpirationTime * 1000,
    });

    return { user };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ operationId: 'register' })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiConflictResponse({})
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { user, accessToken } = await this.authService.register(registerDto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.environment === Environment.PRODUCTION,
      sameSite: 'lax',
      maxAge: this.configService.jwtAccessExpirationTime * 1000,
    });

    return { user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'logout' })
  @ApiOkResponse({})
  @ApiUnauthorizedResponse({})
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: this.configService.environment === Environment.PRODUCTION,
      sameSite: 'lax',
      maxAge: 0,
    });

    return { message: 'Successfully logged out' };
  }
}
