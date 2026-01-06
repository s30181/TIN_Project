import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, Min } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class ReserveEventDto {
  @ApiProperty({
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  eventId: number;

  @ApiProperty({
    enum: [AttendanceStatus.paid, AttendanceStatus.reserved],
    example: AttendanceStatus.reserved,
  })
  @IsIn([AttendanceStatus.paid, AttendanceStatus.reserved])
  @IsNotEmpty()
  status: AttendanceStatus;
}
