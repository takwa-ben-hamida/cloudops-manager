import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateMetricDto {
  @ApiProperty({ example: 45, description: 'Utilisation CPU en pourcentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  cpuUsage: number;

  @ApiProperty({ example: 60, description: 'Utilisation RAM en pourcentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  ramUsage: number;

  @ApiProperty({ example: 1, description: 'ID du serveur associé' })
  @IsInt()
  @Min(1)
  serverId: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}