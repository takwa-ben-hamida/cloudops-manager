import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TeamsService', () => {
  let service: TeamsService;

  // Faux Prisma : les tests ne touchent pas la vraie base de données
  const prismaMock = {
    project: { findUnique: jest.fn() },
    team: {
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
        TeamsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crée une équipe si le projet existe', async () => {
    prismaMock.project.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.team.create.mockResolvedValue({
      id: 1,
      name: 'Backend',
      projectId: 1,
    });

    const result = await service.create({ name: 'Backend', projectId: 1 });

    expect(result.name).toBe('Backend');
  });

  it('refuse la création si le projet est introuvable', async () => {
    prismaMock.project.findUnique.mockResolvedValue(null);

    await expect(
      service.create({ name: 'Backend', projectId: 99 }),
    ).rejects.toThrow(NotFoundException);
    expect(prismaMock.team.create).not.toHaveBeenCalled();
  });

  it('lève NotFoundException si l’équipe n’existe pas', async () => {
    prismaMock.team.findUnique.mockResolvedValue(null);

    await expect(service.findOne(42)).rejects.toThrow(NotFoundException);
  });
});