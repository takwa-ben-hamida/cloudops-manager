import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateAlertDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  severity: string;
}