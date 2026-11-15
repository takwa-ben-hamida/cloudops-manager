import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateIncidentDto {

  @ApiProperty({ example: 'Server unavailable' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'OPEN' })
  @IsString()
  @IsNotEmpty()
  status: string;
}