import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { GetEventsQueryDto } from '../events/dto/get-events-query.dto';
import { PagedEventsDto } from '../events/dto/event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReservationDto } from '../reservations/dto/reservation.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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
