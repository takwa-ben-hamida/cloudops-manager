import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateApplicationDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  environment: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}