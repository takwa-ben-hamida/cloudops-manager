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

import { MonitoringService } from './monitoring.service';
import { CreateMetricDto } from './dto/create-metric.dto/create-metric.dto';

import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/enums';

@ApiTags('Monitoring')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly monitoringService: MonitoringService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer la liste des métriques' })
  @ApiResponse({ status: 200, description: 'Liste des métriques récupérée avec succès' })
  findAll() {
    return this.monitoringService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN, Role.DEVOPS)
  @ApiOperation({ summary: 'Ajouter une métrique' })
  @ApiResponse({ status: 201, description: 'Métrique ajoutée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Serveur introuvable' })
  create(@Body() dto: CreateMetricDto) {
    return this.monitoringService.create(dto);
  }
}