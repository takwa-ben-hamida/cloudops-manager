
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer une équipe
  async create(dto: CreateTeamDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Projet introuvable');
    }

    return this.prisma.team.create({
      data: {
        name: dto.name,
        projectId: dto.projectId,
      },
    });
  }

  // Afficher toutes les équipes
  async findAll() {
    return this.prisma.team.findMany({
      include: {
        project: true,
      },
    });
  }

  // Chercher une équipe par ID
  async findOne(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Équipe introuvable');
    }

    return team;
  }

  // Modifier une équipe
  async update(id: number, dto: UpdateTeamDto) {
    await this.findOne(id);

    if (dto.projectId !== undefined) {
      const project = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
      });

      if (!project) {
        throw new NotFoundException('Projet introuvable');
      }
    }

    return this.prisma.team.update({
      where: { id },
      data: {
        name: dto.name,
        projectId: dto.projectId,
      },
    });
  }


  // Supprimer une équipe
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.team.delete({
      where: { id },
    });
  }


}
