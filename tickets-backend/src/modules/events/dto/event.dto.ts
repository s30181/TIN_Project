import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EventDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  location?: string | null;

  @ApiProperty()
  startsAt: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  organizerId: number;

  @ApiProperty()
  createdAt: Date;
}

export class PagedEventsDto {
  @ApiProperty({ type: [EventDto] })
  events: EventDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
