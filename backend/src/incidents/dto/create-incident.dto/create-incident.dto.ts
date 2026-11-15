import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateIncidentDto {

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}