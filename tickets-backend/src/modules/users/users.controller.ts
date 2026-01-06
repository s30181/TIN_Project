import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiQuery,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto, PagedUsersDto } from './dto/user.dto';
import { GetEventsQueryDto } from '../events/dto/get-events-query.dto';
import { PagedEventsDto } from '../events/dto/event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReservationDto } from '../reservations/dto/reservation.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @ApiCookieAuth()
  @ApiOkResponse({ type: PagedUsersDto })
  @ApiOperation({ operationId: 'getAllUsers' })
  @ApiQuery({ type: GetUsersQueryDto })
  async findAll(@Query() query: GetUsersQueryDto): Promise<PagedUsersDto> {
    return this.usersService.findAll(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({
    operationId: 'getCurrentUser',
  })
  getMe(@CurrentUser() user: UserDto): UserDto {
    return user;
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({ operationId: 'findUserById' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @ApiCookieAuth()
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({ operationId: 'updateUser' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Get(':id/ticket')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [ReservationDto] })
  @ApiOperation({ operationId: 'getUserTickets' })
  async getUserTickets(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReservationDto[]> {
    return this.usersService.getUserTickets(id);
  }

  @Get(':id/events')
  @ApiOkResponse({ type: PagedEventsDto })
  @ApiOperation({ operationId: 'getUserEvents' })
  @ApiQuery({ type: GetEventsQueryDto })
  async getUserEvents(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetEventsQueryDto,
  ): Promise<PagedEventsDto> {
    return this.usersService.getUserEvents(id, query);
  }
}
