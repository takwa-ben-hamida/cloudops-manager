
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';

import { ServerStatus } from '../../../generated/prisma/enums';

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
  @IsInt()
  @Min(1)
  cpu: number;

  @ApiProperty({ example: 16 })
  @IsInt()
  @Min(1)
  ram: number;

  @ApiProperty({ example: 500 })
  @IsInt()
  @Min(1)
  storage: number;

  @ApiProperty({ example: '192.168.1.10' })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @ApiProperty({ example: 1, description: 'ID du projet associé' })
  @IsInt()
  @Min(1)
  projectId: number;

  @ApiPropertyOptional({
    enum: ServerStatus,
    example: 'RUNNING',
    default: 'STOPPED',
  })
  @IsOptional()
  @IsEnum(ServerStatus)
  status?: ServerStatus;
}
