import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const reflectorMock = { getAllAndOverride: jest.fn() };
  const guard = new RolesGuard(reflectorMock as unknown as Reflector);

  // Crée un faux contexte HTTP avec l'utilisateur donné
  const createContext = (role?: string) =>
    ({
      getHandler: () => undefined,
      getClass: () => undefined,
      switchToHttp: () => ({
        getRequest: () => ({ user: role ? { sub: 1, role } : undefined }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => jest.clearAllMocks());

  it('laisse passer si la route ne demande aucun rôle', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(createContext('VIEWER'))).toBe(true);
  });

  it('laisse passer un ADMIN sur une route ADMIN/DEVOPS', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['ADMIN', 'DEVOPS']);

    expect(guard.canActivate(createContext('ADMIN'))).toBe(true);
  });

  it('refuse un VIEWER sur une route ADMIN/DEVOPS (403)', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['ADMIN', 'DEVOPS']);

    expect(() => guard.canActivate(createContext('VIEWER'))).toThrow(
      ForbiddenException,
    );
  });
});