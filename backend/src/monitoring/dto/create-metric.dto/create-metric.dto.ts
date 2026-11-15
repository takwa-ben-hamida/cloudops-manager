import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateMetricDto {

  @ApiProperty({ example: 45 })
  @IsNumber()
  cpuUsage: number;

  @ApiProperty({ example: 60 })
  @IsNumber()
  ramUsage: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  availability: boolean;
}