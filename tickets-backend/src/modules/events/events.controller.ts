import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { GetEventsQueryDto } from './dto/get-events-query.dto';
import { EventDto, PagedEventsDto } from './dto/event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { ReservationDto } from '../reservations/dto/reservation.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'createEvent',
  })
  @ApiCreatedResponse({ type: EventDto })
  create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: UserDto,
  ): Promise<EventDto> {
    return this.eventsService.create(createEventDto, user.id);
  }

  @Get()
  @ApiOperation({
    operationId: 'getEvents',
  })
  @ApiOkResponse({ type: PagedEventsDto })
  findAll(@Query() query: GetEventsQueryDto): Promise<PagedEventsDto> {
    return this.eventsService.findAll(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getMyEvents',
  })
  @ApiOkResponse({ type: PagedEventsDto })
  findMyEvents(
    @CurrentUser() user: UserDto,
    @Query() query: GetEventsQueryDto,
  ): Promise<PagedEventsDto> {
    return this.eventsService.findMyEvents(user.id, query);
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getEventById',
  })
  @ApiOkResponse({ type: EventDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EventDto> {
    return this.eventsService.findOne(id);
  }

  @Get(':id/reservations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getEventReservations',
  })
  @ApiOkResponse({ type: [ReservationDto] })
  findReservations(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserDto,
  ): Promise<ReservationDto[]> {
    return this.eventsService.findReservations(id, user.id, user.role);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'updateEvent',
  })
  @ApiOkResponse({ type: EventDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: UserDto,
  ): Promise<EventDto> {
    return this.eventsService.update(id, updateEventDto, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'deleteEvent',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserDto,
  ): Promise<void> {
    return this.eventsService.remove(id, user.id, user.role);
  }
}
