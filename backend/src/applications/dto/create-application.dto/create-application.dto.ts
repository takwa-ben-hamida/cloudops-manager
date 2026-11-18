import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateApplicationDto {

  @ApiProperty({ example: 'CloudOps Dashboard' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '1.0.0' })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({ example: 'Production' })
  @IsString()
  @IsNotEmpty()
  environment: string;

  @ApiProperty({ example: 'Running' })
  @IsString()
  @IsNotEmpty()
  status: string;
}