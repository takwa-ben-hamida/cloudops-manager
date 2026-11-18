import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const jwtServiceMock = { verifyAsync: jest.fn() };
  const guard = new AuthGuard(jwtServiceMock as unknown as JwtService);

  // Crée un faux contexte HTTP avec le header Authorization donné
  const createContext = (authorization?: string) => {
    const request: { headers: { authorization?: string }; user?: unknown } = {
      headers: { authorization },
    };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
    return { context, request };
  };

  beforeEach(() => jest.clearAllMocks());

  it('accepte un token valide et ajoute user à la requête', async () => {
    const payload = { sub: 1, email: 'takwa@test.com', role: 'ADMIN' };
    jwtServiceMock.verifyAsync.mockResolvedValue(payload);
    const { context, request } = createContext('Bearer valid.token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual(payload);
  });

  it('refuse une requête sans token', async () => {
    const { context } = createContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('refuse un token invalide', async () => {
    jwtServiceMock.verifyAsync.mockRejectedValue(new Error('invalid'));
    const { context } = createContext('Bearer faux.token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});