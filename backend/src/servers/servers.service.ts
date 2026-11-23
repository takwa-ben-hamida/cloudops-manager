
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateServerDto } from './dto/create-server.dto/create-server.dto';

@Injectable()
export class ServersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Récupérer tous les serveurs
  async findAll() {
    return this.prisma.server.findMany({
      include: {
        project: true,
      },
    });
  }

  // Créer un serveur
  async create(dto: CreateServerDto) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: dto.projectId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projet introuvable');
    }

    return this.prisma.server.create({
      data: {
        name: dto.name,
        provider: dto.provider,
        region: dto.region,
        cpu: dto.cpu,
        ram: dto.ram,
        storage: dto.storage,
        ipAddress: dto.ipAddress,
        projectId: dto.projectId,
        status: dto.status ?? 'STOPPED',
      },
      include: {
        project: true,
      },
    });
  }
}
