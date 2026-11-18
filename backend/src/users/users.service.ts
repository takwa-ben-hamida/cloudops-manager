import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

// Champs renvoyés au client : jamais le mot de passe
const publicUserFields = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer un utilisateur avec un mot de passe haché
  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      },
      select: publicUserFields,
    });
  }

  // Afficher tous les utilisateurs (sans mot de passe)
  async findAll() {
    return this.prisma.user.findMany({ select: publicUserFields });
  }

  // Chercher un utilisateur par ID (sans mot de passe)
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: publicUserFields,
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  // Utilisé par le login : renvoie aussi le mot de passe haché
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}