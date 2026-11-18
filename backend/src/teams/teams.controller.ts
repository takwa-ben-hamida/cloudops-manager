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

import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/enums';

@ApiTags('Teams')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
@UseGuards(AuthGuard, RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({ summary: 'Créer une équipe (ADMIN, DEVOPS)' })
  @ApiResponse({ status: 201, description: 'Équipe créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant' })
  @ApiResponse({ status: 404, description: 'Projet introuvable' })
  create(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les équipes' })
  @ApiResponse({ status: 200, description: 'Liste des équipes' })
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Afficher une équipe par ID' })
  @ApiResponse({ status: 200, description: 'Équipe trouvée' })
  @ApiResponse({ status: 404, description: 'Équipe introuvable' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({ summary: 'Modifier une équipe (ADMIN, DEVOPS)' })
  @ApiResponse({ status: 200, description: 'Équipe modifiée' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant' })
  @ApiResponse({ status: 404, description: 'Équipe ou projet introuvable' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({ summary: 'Supprimer une équipe (ADMIN, DEVOPS)' })
  @ApiResponse({ status: 200, description: 'Équipe supprimée' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant' })
  @ApiResponse({ status: 404, description: 'Équipe introuvable' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.remove(id);
  }
}