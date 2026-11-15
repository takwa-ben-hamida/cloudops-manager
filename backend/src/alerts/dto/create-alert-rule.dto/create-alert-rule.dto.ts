import {
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateAlertRuleDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  threshold: number;

  @IsString()
  @IsNotEmpty()
  condition: string;
}