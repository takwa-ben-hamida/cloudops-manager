
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto/create-server.dto';

import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/enums';

@ApiTags('Servers')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('servers')
export class ServersController {
  constructor(
    private readonly serversService: ServersService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Récupérer la liste des serveurs',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des serveurs récupérée avec succès',
  })
  findAll() {
    return this.serversService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({
    summary: 'Créer un serveur',
  })
  @ApiResponse({
    status: 201,
    description: 'Serveur créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 404,
    description: 'Projet introuvable',
  })
  create(@Body() dto: CreateServerDto) {
    return this.serversService.create(dto);
  }
}
