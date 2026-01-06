import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { ReservationDto } from './dto/reservation.dto';
import { ReserveEventDto } from './dto/reserve-event.dto';
import { GetReservationsQueryDto } from './dto/get-reservations-query.dto';
import { PagedReservationsDto } from './dto/paged-reservations.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDto } from '../users/dto/user.dto';

@ApiTags('reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Get()
  @ApiOperation({
    summary: 'Get paginated reservations',
    operationId: 'getReservations',
  })
  @ApiOkResponse({ type: PagedReservationsDto })
  getReservations(
    @Query() query: GetReservationsQueryDto,
    @CurrentUser() user: UserDto,
  ): Promise<PagedReservationsDto> {
    return this.reservationsService.getReservations(query, user.id, user.role);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get my reservations',
    operationId: 'getMyReservations',
  })
  @ApiOkResponse({ type: [ReservationDto] })
  getMyReservations(@CurrentUser() user: UserDto): Promise<ReservationDto[]> {
    return this.reservationsService.getMyReservations(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get reservation by ID',
    operationId: 'getReservationById',
  })
  @ApiOkResponse({ type: ReservationDto })
  getReservationById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserDto,
  ): Promise<ReservationDto> {
    return this.reservationsService.getReservationById(id, user.id, user.role);
  }

  @Post()
  @ApiOperation({
    summary: 'Reserve an event',
    operationId: 'reserveEvent',
  })
  @ApiCreatedResponse({ type: ReservationDto })
  reserveEvent(
    @Body() reserveEventDto: ReserveEventDto,
    @CurrentUser() user: UserDto,
  ): Promise<ReservationDto> {
    return this.reservationsService.reserveEvent(user.id, reserveEventDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a reservation',
    operationId: 'updateReservation',
  })
  @ApiOkResponse({ type: ReservationDto })
  updateReservation(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
    @CurrentUser() user: UserDto,
  ): Promise<ReservationDto> {
    return this.reservationsService.updateReservation(
      id,
      updateReservationDto,
      user.id,
      user.role,
    );
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel a reservation',
    operationId: 'cancelReservation',
  })
  cancelReservation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserDto,
  ): Promise<void> {
    return this.reservationsService.cancelReservation(user.id, id, user.role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a reservation',
    operationId: 'deleteReservation',
  })
  deleteReservation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserDto,
  ): Promise<void> {
    return this.reservationsService.deleteReservation(user.id, id, user.role);
  }
}
