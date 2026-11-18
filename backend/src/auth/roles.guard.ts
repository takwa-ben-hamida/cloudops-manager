import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../generated/prisma/enums';
import { ROLES_KEY } from './roles.decorator';
import { JwtPayload } from './auth.guard';

// À utiliser après AuthGuard : @UseGuards(AuthGuard, RolesGuard)
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Rôles demandés par @Roles(...) sur la méthode ou sur le controller
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Pas de @Roles → tout utilisateur connecté peut accéder
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: JwtPayload }>();

    if (!user || !requiredRoles.includes(user.role as Role)) {
      throw new ForbiddenException('Accès refusé : rôle insuffisant');
    }

    return true;
  }
}