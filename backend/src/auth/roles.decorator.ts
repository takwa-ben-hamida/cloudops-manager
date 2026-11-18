import { SetMetadata } from '@nestjs/common';
import { Role } from '../generated/prisma/enums';

export const ROLES_KEY = 'roles';

// Exemple : @Roles(Role.ADMIN, Role.DEVOPS)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);