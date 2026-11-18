import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EnvironmentsService } from './environments.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/enums';

@ApiTags('Environments')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
@UseGuards(AuthGuard, RolesGuard)
@Controller('environments')
export class EnvironmentsController {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({ summary: 'Créer un environnement (ADMIN, DEVOPS)' })
  @ApiResponse({ status: 201, description: 'Environnement créé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant' })
  @ApiResponse({ status: 404, description: 'Projet introuvable' })
  @ApiResponse({ status: 409, description: 'Nom déjà utilisé dans ce projet' })
  create(@Body() dto: CreateEnvironmentDto) {
    return this.environmentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les environnements' })
  @ApiQuery({
    name: 'projectId',
    required: false,
    type: Number,
    description: 'Filtrer par projet',
  })
  @ApiResponse({ status: 200, description: 'Liste des environnements' })
  findAll(
    @Query('projectId', new ParseIntPipe({ optional: true }))
    projectId?: number,
  ) {
    return this.environmentsService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Afficher un environnement par ID' })
  @ApiResponse({ status: 200, description: 'Environnement trouvé' })
  @ApiResponse({ status: 404, description: 'Environnement introuvable' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.environmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({ summary: 'Modifier un environnement (ADMIN, DEVOPS)' })
  @ApiResponse({ status: 200, description: 'Environnement modifié' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant' })
  @ApiResponse({ status: 404, description: 'Environnement introuvable' })
  @ApiResponse({ status: 409, description: 'Nom déjà utilisé dans ce projet' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEnvironmentDto,
  ) {
    return this.environmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({ summary: 'Supprimer un environnement (ADMIN, DEVOPS)' })
  @ApiResponse({ status: 200, description: 'Environnement supprimé' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant' })
  @ApiResponse({ status: 404, description: 'Environnement introuvable' })
  @ApiResponse({ status: 409, description: 'Des applications utilisent cet environnement' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.environmentsService.remove(id);
  }
}