import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn().mockResolvedValue('fake.jwt.token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('renvoie un token si email et mot de passe sont corrects', async () => {
    usersServiceMock.findByEmail.mockResolvedValue({
      id: 1,
      fullName: 'Takwa',
      email: 'takwa@test.com',
      role: 'ADMIN',
      password: await bcrypt.hash('secret123', 10),
    });

    const result = await service.login({
      email: 'takwa@test.com',
      password: 'secret123',
    });

    expect(result.access_token).toBe('fake.jwt.token');
    expect(result.user).not.toHaveProperty('password');
    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
      sub: 1,
      email: 'takwa@test.com',
      role: 'ADMIN',
    });
  });

  it('refuse un mauvais mot de passe', async () => {
    usersServiceMock.findByEmail.mockResolvedValue({
      id: 1,
      email: 'takwa@test.com',
      password: await bcrypt.hash('secret123', 10),
    });

    await expect(
      service.login({ email: 'takwa@test.com', password: 'faux' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('refuse un email inconnu', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'inconnu@test.com', password: 'secret123' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});