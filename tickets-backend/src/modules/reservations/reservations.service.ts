import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ReservationDto } from './dto/reservation.dto';
import { ReserveEventDto } from './dto/reserve-event.dto';
import {
  AttendanceStatus,
  Event,
  Reservation,
  User,
  UserRole,
} from '@prisma/client';
import { GetReservationsQueryDto } from './dto/get-reservations-query.dto';
import { PagedReservationsDto } from './dto/paged-reservations.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) { }

  private formatDateToString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private toReservationDto(
    reservation: Reservation & { event: Event; user?: User },
  ): ReservationDto {
    const dto: ReservationDto = {
      ...reservation,
      event: {
        ...reservation.event,
        startsAt: this.formatDateToString(reservation.event.startsAt),
      },
    };

    if (reservation.user) {
      dto.user = reservation.user;
    }
    return dto;
  }

  async getMyReservations(userId: number): Promise<ReservationDto[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });
    return reservations.map((r) =>
      this.toReservationDto(r as Reservation & { event: Event; user?: User }),
    );
  }

  async reserveEvent(
    userId: number,
    reserveEventDto: ReserveEventDto,
  ): Promise<ReservationDto> {
    const { eventId, status } = reserveEventDto;

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const existingReservation = await this.prisma.reservation.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existingReservation) {
      throw new ConflictException(
        'You already have a reservation for this event',
      );
    }

    const reservation = await this.prisma.reservation.create({
      data: { userId, eventId, status },
      include: { event: true },
    });
    return this.toReservationDto(
      reservation as Reservation & { event: Event; user?: User },
    );
  }

  async cancelReservation(
    userId: number,
    reservationId: number,
    userRole: UserRole,
  ): Promise<void> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException(
        `Reservation with ID ${reservationId} not found`,
      );
    }

    if (reservation.userId !== userId && userRole !== UserRole.admin) {
      throw new ForbiddenException('You do not own this reservation');
    }

    await this.prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: AttendanceStatus.cancelled,
      },
    });
  }

  async deleteReservation(
    userId: number,
    reservationId: number,
    userRole: UserRole,
  ): Promise<void> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException(
        `Reservation with ID ${reservationId} not found`,
      );
    }

    if (reservation.userId !== userId && userRole !== UserRole.admin) {
      throw new ForbiddenException('You do not own this reservation');
    }

    await this.prisma.reservation.delete({
      where: { id: reservationId },
    });
  }

  async getReservations(
    query: GetReservationsQueryDto,
    userId: number,
    userRole: UserRole,
  ): Promise<PagedReservationsDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const isAdmin = userRole === UserRole.admin;
    const where = isAdmin ? {} : { userId };

    const [reservations, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        include: {
          event: true,
          user: isAdmin,
        },
        orderBy: { purchasedAt: 'desc' },
      }),
      this.prisma.reservation.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      reservations: reservations.map((r) =>
        this.toReservationDto(r as Reservation & { event: Event; user?: User }),
      ),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getReservationById(
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<ReservationDto> {
    const isAdmin = userRole === UserRole.admin;

    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        event: true,
        user: isAdmin,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    if (reservation.userId !== userId && !isAdmin) {
      throw new ForbiddenException('You do not own this reservation');
    }

    return this.toReservationDto(
      reservation as Reservation & { event: Event; user?: User },
    );
  }

  async updateReservation(
    id: number,
    updateDto: UpdateReservationDto,
    userId: number,
    userRole: UserRole,
  ): Promise<ReservationDto> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    if (reservation.userId !== userId && userRole !== UserRole.admin) {
      throw new ForbiddenException('You do not own this reservation');
    }

    if (updateDto.eventId && updateDto.eventId !== reservation.eventId) {
      const event = await this.prisma.event.findUnique({
        where: { id: updateDto.eventId },
      });
      if (!event) {
        throw new NotFoundException(
          `Event with ID ${updateDto.eventId} not found`,
        );
      }

      const existingReservation = await this.prisma.reservation.findUnique({
        where: {
          userId_eventId: {
            userId: reservation.userId,
            eventId: updateDto.eventId,
          },
        },
      });
      if (existingReservation) {
        throw new ConflictException(
          'Already have a reservation for this event',
        );
      }
    }

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: updateDto,
      include: { event: true },
    });
    return this.toReservationDto(
      updated as Reservation & { event: Event; user?: User },
    );
  }
}
