import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateAlertDto {

  @ApiProperty({ example: 'High CPU Usage' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'CPU exceeded threshold' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'HIGH' })
  @IsString()
  @IsNotEmpty()
  severity: string;
}