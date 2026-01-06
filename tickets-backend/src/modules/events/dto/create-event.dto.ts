import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Length,
  Min,
  Max,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @ApiPropertyOptional({
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @ApiProperty({
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    format: 'date',
  })
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startsAt must be in YYYY-MM-DD format',
  })
  startsAt: string;

  @ApiProperty({
    example: 50,
    minimum: 0,
    maximum: 1000000,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
  price: number;
}
