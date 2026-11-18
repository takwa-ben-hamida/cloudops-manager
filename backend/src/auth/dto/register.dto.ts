import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Inscription publique : le role est VIEWER par defaut
export class RegisterDto {
  @ApiProperty({ example: 'Takwa Ben Hamida' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'takwa@cloudops.tn' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
