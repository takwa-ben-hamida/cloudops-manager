import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Inscription : crée un utilisateur avec le rôle VIEWER par défaut
  async register(dto: RegisterDto) {
    return this.usersService.create(dto);
  }

  // Login : vérifie email + mot de passe, puis génère le token JWT
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // Même message dans les deux cas pour ne pas révéler si l'email existe
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }
}