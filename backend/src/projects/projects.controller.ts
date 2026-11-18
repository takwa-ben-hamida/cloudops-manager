import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/enums';

@ApiTags('Projects')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
@UseGuards(AuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({ summary: 'Créer un projet (ADMIN, DEVOPS)' })
  @ApiResponse({ status: 201, description: 'Projet créé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les projets' })
  @ApiResponse({ status: 200, description: 'Liste des projets' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Afficher un projet par ID' })
  @ApiResponse({ status: 200, description: 'Projet trouvé' })
  @ApiResponse({ status: 404, description: 'Projet introuvable' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({ summary: 'Modifier un projet (ADMIN, DEVOPS)' })
  @ApiResponse({ status: 200, description: 'Projet modifié' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant' })
  @ApiResponse({ status: 404, description: 'Projet introuvable' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({ summary: 'Supprimer un projet (ADMIN, DEVOPS)' })
  @ApiResponse({ status: 200, description: 'Projet supprimé' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant' })
  @ApiResponse({ status: 404, description: 'Projet introuvable' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}