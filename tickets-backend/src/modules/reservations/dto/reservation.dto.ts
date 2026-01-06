import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttendanceStatus } from '@prisma/client';
import { EventDto } from 'src/modules/events/dto/event.dto';
import { UserDto } from 'src/modules/users/dto/user.dto';

export class ReservationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  eventId: number;

  @ApiProperty({ enum: AttendanceStatus })
  status: AttendanceStatus;

  @ApiProperty()
  purchasedAt: Date;

  @ApiProperty({ type: EventDto })
  event: EventDto;

  @ApiPropertyOptional({ type: UserDto })
  user?: UserDto;
}
