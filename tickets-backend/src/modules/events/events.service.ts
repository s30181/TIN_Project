import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { GetEventsQueryDto } from './dto/get-events-query.dto';
import { EventDto, PagedEventsDto } from './dto/event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, Reservation, User, UserRole } from '@prisma/client';
import { ReservationDto } from '../reservations/dto/reservation.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) { }

  private formatDateToString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private toEventDto(event: Event): EventDto {
    return {
      ...event,
      startsAt: this.formatDateToString(event.startsAt),
    };
  }

  async create(
    createEventDto: CreateEventDto,
    userId: number,
  ): Promise<EventDto> {
    const { startsAt, ...rest } = createEventDto;
    const event = await this.prisma.event.create({
      data: {
        ...rest,
        startsAt: new Date(startsAt + 'T00:00:00Z'),
        organizerId: userId,
      },
    });
    return this.toEventDto(event);
  }

  async findAll(query: GetEventsQueryDto): Promise<PagedEventsDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.event.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      events: events.map((e) => this.toEventDto(e)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findMyEvents(
    userId: number,
    query: GetEventsQueryDto,
  ): Promise<PagedEventsDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = { organizerId: userId };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      events: events.map((e) => this.toEventDto(e)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<EventDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return this.toEventDto(event);
  }

  private toReservationDto(
    reservation: Reservation & { event: Event; user?: User },
  ): ReservationDto {
    const { user, ...rest } = reservation;
    return {
      ...rest,
      event: this.toEventDto(reservation.event),
      ...(user && {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      }),
    };
  }

  async findReservations(
    eventId: number,
    userId: number,
    userRole: UserRole,
  ): Promise<ReservationDto[]> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const isOrganizer = event.organizerId === userId;
    const isAdmin = userRole === UserRole.admin;

    let reservations: Array<Reservation & { event: Event; user?: User }>;
    if (isOrganizer || isAdmin) {
      reservations = await this.prisma.reservation.findMany({
        where: { eventId },
        include: {
          event: true,
          user: true,
        },
        orderBy: {
          purchasedAt: 'desc',
        },
      });
    } else {
      reservations = await this.prisma.reservation.findMany({
        where: {
          eventId,
          userId,
        },
        include: {
          event: true,
        },
        orderBy: {
          purchasedAt: 'desc',
        },
      });
    }

    return reservations.map((r) => this.toReservationDto(r));
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    userId: number,
    userRole: UserRole,
  ): Promise<EventDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.organizerId !== userId && userRole !== UserRole.admin) {
      throw new ForbiddenException(
        'You do not have permission to update this event',
      );
    }

    const { startsAt, ...rest } = updateEventDto;

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        ...rest,
        ...(startsAt && { startsAt: new Date(startsAt + 'T00:00:00Z') }),
      },
    });
    return this.toEventDto(updated);
  }

  async remove(id: number, userId: number, userRole: UserRole): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.organizerId !== userId && userRole !== UserRole.admin) {
      throw new ForbiddenException(
        'You do not have permission to delete this event',
      );
    }

    await this.prisma.event.delete({
      where: { id },
    });
  }
}
