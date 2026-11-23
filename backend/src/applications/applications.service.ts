
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Récupérer toutes les applications
  async findAll() {
    return this.prisma.application.findMany({
      include: {
        server: true,
        environment: true,
      },
    });
  }

  // Créer une application
  async create(dto: CreateApplicationDto) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: dto.serverId,
      },
    });

    if (!server) {
      throw new NotFoundException('Serveur introuvable');
    }

    const environment = await this.prisma.environment.findUnique({
      where: {
        id: dto.environmentId,
      },
    });

    if (!environment) {
      throw new NotFoundException('Environnement introuvable');
    }

    return this.prisma.application.create({
      data: {
        name: dto.name,
        version: dto.version,
        serverId: dto.serverId,
        environmentId: dto.environmentId,
        status: dto.status ?? 'STOPPED',
      },
      include: {
        server: true,
        environment: true,
      },
    });
  }
}
