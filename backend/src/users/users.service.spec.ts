import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  // Faux Prisma : les tests ne touchent pas la vraie base de données
  const prismaMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('hache le mot de passe avant de créer l’utilisateur', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 1 });

    await service.create({
      fullName: 'Takwa',
      email: 'takwa@test.com',
      password: 'secret123',
    });

    const data = prismaMock.user.create.mock.calls[0][0].data;
    expect(data.password).not.toBe('secret123');
    expect(await bcrypt.compare('secret123', data.password)).toBe(true);
  });

  it('refuse un email déjà utilisé', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1 });

    await expect(
      service.create({
        fullName: 'Takwa',
        email: 'takwa@test.com',
        password: 'secret123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('lève NotFoundException si l’utilisateur n’existe pas', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(service.findOne(42)).rejects.toThrow(NotFoundException);
  });
});