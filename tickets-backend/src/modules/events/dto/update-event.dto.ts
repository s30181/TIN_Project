import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  Length,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateEventDto {
  @ApiPropertyOptional({
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string | null;

  @ApiPropertyOptional({
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    format: 'date',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startsAt must be in YYYY-MM-DD format',
  })
  startsAt?: string;

  @ApiPropertyOptional({
    example: 50,
    minimum: 0,
    maximum: 1000000,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000000)
  price?: number;
}
