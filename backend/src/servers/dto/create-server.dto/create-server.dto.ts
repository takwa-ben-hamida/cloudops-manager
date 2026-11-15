import {
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateServerDto {
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsNumber()
  cpu: number;

  @IsNumber()
  ram: number;

  @IsNumber()
  storage: number;

  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}