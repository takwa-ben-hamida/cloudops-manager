import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Inscription publique : le rôle n'est pas choisi par l'utilisateur (VIEWER par défaut)
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}