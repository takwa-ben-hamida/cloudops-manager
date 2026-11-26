import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMetricDto } from './dto/create-metric.dto/create-metric.dto';

@Injectable()
export class MonitoringService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Récupérer toutes les métriques
  async findAll() {
    return this.prisma.metric.findMany({
      include: {
        server: true,
      },
      orderBy: {
        recordedAt: 'desc',
      },
    });
  }

  // Ajouter une métrique
  async create(dto: CreateMetricDto) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: dto.serverId,
      },
    });

    if (!server) {
      throw new NotFoundException('Serveur introuvable');
    }

    return this.prisma.metric.create({
      data: {
        cpuUsage: dto.cpuUsage,
        ramUsage: dto.ramUsage,
        serverId: dto.serverId,
        available: dto.available ?? true,
      },
      include: {
        server: true,
      },
    });
  }
}