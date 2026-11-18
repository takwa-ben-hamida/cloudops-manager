import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto/create-incident.dto';

@ApiTags('Incidents')
@Controller('incidents')
export class IncidentsController {

  @Get()
  @ApiOperation({
    summary: 'Récupérer la liste des incidents',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des incidents récupérée avec succès',
  })
  findAll() {
    return {
      message: 'Liste des incidents',
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Créer un incident',
  })
  @ApiResponse({
    status: 201,
    description: 'Incident créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return {
      message: 'Incident créé',
      data: createIncidentDto,
    };
  }
}