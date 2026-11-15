import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto/create-metric.dto';

@ApiTags('Monitoring')
@Controller('monitoring')
export class MonitoringController {

  @Get()
  @ApiOperation({
    summary: 'Récupérer la liste des métriques',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des métriques récupérée avec succès',
  })
  findAll() {
    return {
      message: 'Liste des métriques',
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Ajouter une métrique',
  })
  @ApiResponse({
    status: 201,
    description: 'Métrique ajoutée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(@Body() createMetricDto: CreateMetricDto) {
    return {
      message: 'Métrique ajoutée',
      data: createMetricDto,
    };
  }
}