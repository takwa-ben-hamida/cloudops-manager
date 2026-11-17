import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateEnvironmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsPositive()
  projectId: number;
}