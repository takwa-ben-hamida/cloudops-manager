
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto/create-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.incident.findMany({
      include: {
        alert: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(dto: CreateIncidentDto) {
    if (dto.alertId) {
      const alert = await this.prisma.alert.findUnique({
        where: { id: dto.alertId },
      });

      if (!alert) {
        throw new NotFoundException('Alerte introuvable');
      }
    }

    return this.prisma.incident.create({
      data: {
        description: dto.description,
        status: dto.status ?? 'OPEN',
        alertId: dto.alertId ?? null,
      },
      include: {
        alert: true,
      },
    });
  }
}
