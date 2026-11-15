import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto/create-alert.dto';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {

  @Get()
  @ApiOperation({
    summary: 'Récupérer la liste des alertes',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des alertes récupérée avec succès',
  })
  findAll() {
    return {
      message: 'Liste des alertes',
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Créer une alerte',
  })
  @ApiResponse({
    status: 201,
    description: 'Alerte créée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(@Body() createAlertDto: CreateAlertDto) {
    return {
      message: 'Alerte créée',
      data: createAlertDto,
    };
  }
}