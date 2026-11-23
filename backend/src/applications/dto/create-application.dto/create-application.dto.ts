
import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    example: 'CloudOps Dashboard',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '1.0.0',
  })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({
    example: 1,
    description: 'ID du serveur associé',
  })
  @IsInt()
  @Min(1)
  serverId: number;

  @ApiProperty({
    example: 1,
    description: "ID de l'environnement associé",
  })
  @IsInt()
  @Min(1)
  environmentId: number;

  @ApiProperty({
    enum: ['RUNNING', 'STOPPED', 'DEPLOYING', 'ERROR'],
    required: false,
    default: 'STOPPED',
  })
  @IsOptional()
  @IsEnum(['RUNNING', 'STOPPED', 'DEPLOYING', 'ERROR'])
  status?: 'RUNNING' | 'STOPPED' | 'DEPLOYING' | 'ERROR';
}
