import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EnvironmentsService', () => {
  let service: EnvironmentsService;

  // Faux Prisma : les tests ne touchent pas la vraie base de données
  const prismaMock = {
    project: { findUnique: jest.fn() },
    environment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<EnvironmentsService>(EnvironmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crée un environnement si le projet existe', async () => {
    prismaMock.project.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.environment.findFirst.mockResolvedValue(null);
    prismaMock.environment.create.mockResolvedValue({
      id: 1,
      name: 'dev',
      projectId: 1,
    });

    const result = await service.create({ name: 'dev', projectId: 1 });

    expect(result.name).toBe('dev');
    expect(prismaMock.environment.create).toHaveBeenCalled();
  });

  it('refuse la création si le projet est introuvable', async () => {
    prismaMock.project.findUnique.mockResolvedValue(null);

    await expect(
      service.create({ name: 'dev', projectId: 99 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('refuse un nom déjà utilisé dans le même projet', async () => {
    prismaMock.project.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.environment.findFirst.mockResolvedValue({ id: 2, name: 'dev' });

    await expect(
      service.create({ name: 'dev', projectId: 1 }),
    ).rejects.toThrow(ConflictException);
  });

  it('lève NotFoundException si l’environnement n’existe pas', async () => {
    prismaMock.environment.findUnique.mockResolvedValue(null);

    await expect(service.findOne(42)).rejects.toThrow(NotFoundException);
  });

  it('refuse la suppression si des applications sont liées', async () => {
    prismaMock.environment.findUnique.mockResolvedValue({
      id: 1,
      name: 'prod',
      projectId: 1,
      applications: [{ id: 5 }],
    });

    await expect(service.remove(1)).rejects.toThrow(ConflictException);
    expect(prismaMock.environment.delete).not.toHaveBeenCalled();
  });
});