
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateIncidentDto {
  @ApiProperty({ example: 'Server unavailable' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'OPEN', default: 'OPEN' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  status?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID de l’alerte associée' })
  @IsOptional()
  @IsInt()
  @Min(1)
  alertId?: number;
}
