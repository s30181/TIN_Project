import { ApiProperty } from '@nestjs/swagger';
import { ReservationDto } from './reservation.dto';

export class PagedReservationsDto {
  @ApiProperty({ type: [ReservationDto] })
  reservations: ReservationDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
