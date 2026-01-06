import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class UpdateReservationDto {
  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  eventId?: number;

  @ApiPropertyOptional({
    enum: [AttendanceStatus.paid, AttendanceStatus.reserved],
    example: AttendanceStatus.paid,
  })
  @IsOptional()
  @IsIn([AttendanceStatus.paid, AttendanceStatus.reserved])
  status?: AttendanceStatus;
}
