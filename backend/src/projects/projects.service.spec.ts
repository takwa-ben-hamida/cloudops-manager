import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  // Faux Prisma : les tests ne touchent pas la vraie base de données
  const prismaMock = {
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crée un projet', async () => {
    prismaMock.project.create.mockResolvedValue({ id: 1, name: 'CloudOps' });

    const result = await service.create({ name: 'CloudOps' });

    expect(result.name).toBe('CloudOps');
  });

  it('lève NotFoundException si le projet n’existe pas', async () => {
    prismaMock.project.findUnique.mockResolvedValue(null);

    await expect(service.findOne(42)).rejects.toThrow(NotFoundException);
  });

  it('ne supprime pas un projet introuvable', async () => {
    prismaMock.project.findUnique.mockResolvedValue(null);

    await expect(service.remove(42)).rejects.toThrow(NotFoundException);
    expect(prismaMock.project.delete).not.toHaveBeenCalled();
  });
});