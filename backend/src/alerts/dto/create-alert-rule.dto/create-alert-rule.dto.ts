import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateAlertRuleDto {

  @ApiProperty({ example: 'CPU Alert' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 80 })
  @IsNumber()
  threshold: number;

  @ApiProperty({ example: '>' })
  @IsString()
  @IsNotEmpty()
  condition: string;
}