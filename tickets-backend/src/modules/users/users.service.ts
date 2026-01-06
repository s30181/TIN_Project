import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Event, User } from '@prisma/client';
import { GetEventsQueryDto } from '../events/dto/get-events-query.dto';
import { EventDto, PagedEventsDto } from '../events/dto/event.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
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

  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { passwordHash, ...userDto } = user;
    return userDto as UserDto;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserEvents(
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

  async getUserTickets(userId: number) {
    const reservations = await this.prisma.reservation.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });

    return reservations.map((r) => ({
      ...r,
      event: this.toEventDto(r.event),
    }));
  }
}
