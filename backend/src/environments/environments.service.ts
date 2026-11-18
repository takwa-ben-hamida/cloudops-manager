import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';

@Injectable()
export class EnvironmentsService {
  constructor(private readonly prisma: PrismaService) {}

  // Créer un environnement
  async create(dto: CreateEnvironmentDto) {
    await this.checkProject(dto.projectId);
    await this.checkNameAvailable(dto.projectId, dto.name);

    return this.prisma.environment.create({
      data: {
        name: dto.name,
        projectId: dto.projectId,
      },
    });
  }

  // Afficher tous les environnements (option : filtrer par projet)
  async findAll(projectId?: number) {
    return this.prisma.environment.findMany({
      where: projectId ? { projectId } : undefined,
      include: { project: true },
    });
  }

  // Chercher un environnement par ID
  async findOne(id: number) {
    const environment = await this.prisma.environment.findUnique({
      where: { id },
      include: { project: true, applications: true },
    });

    if (!environment) {
      throw new NotFoundException('Environnement introuvable');
    }

    return environment;
  }

  // Modifier un environnement
  async update(id: number, dto: UpdateEnvironmentDto) {
    const current = await this.findOne(id);

    if (dto.projectId !== undefined) {
      await this.checkProject(dto.projectId);
    }

    const projectId = dto.projectId ?? current.projectId;
    const name = dto.name ?? current.name;

    if (projectId !== current.projectId || name !== current.name) {
      await this.checkNameAvailable(projectId, name);
    }

    return this.prisma.environment.update({
      where: { id },
      data: {
        name: dto.name,
        projectId: dto.projectId,
      },
    });
  }

  // Supprimer un environnement
  async remove(id: number) {
    const environment = await this.findOne(id);

    if (environment.applications.length > 0) {
      throw new ConflictException(
        'Impossible de supprimer : des applications utilisent cet environnement',
      );
    }

    return this.prisma.environment.delete({
      where: { id },
    });
  }

  // Vérifier que le projet existe
  private async checkProject(projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Projet introuvable');
    }
  }

  // Un nom d'environnement doit être unique dans un projet
  private async checkNameAvailable(projectId: number, name: string) {
    const existing = await this.prisma.environment.findFirst({
      where: { projectId, name },
    });

    if (existing) {
      throw new ConflictException(
        'Un environnement avec ce nom existe déjà dans ce projet',
      );
    }
  }
}