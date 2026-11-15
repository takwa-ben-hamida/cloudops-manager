import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateServerDto {

  @ApiProperty({ example: 'Web Server 01' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'AWS' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ example: 'eu-west-1' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  cpu: number;

  @ApiProperty({ example: 16 })
  @IsNumber()
  ram: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  storage: number;

  @ApiProperty({ example: '192.168.1.10' })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @ApiProperty({ example: 'ACTIVE' })
  @IsString()
  @IsNotEmpty()
  status: string;
}