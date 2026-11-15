import {
  IsNumber,
  IsBoolean 
} from 'class-validator';

export class CreateMetricDto {
  @IsNumber()
  cpuUsage: number;

  @IsNumber()
  ramUsage: number;

  @IsBoolean()
  availability: boolean;
}