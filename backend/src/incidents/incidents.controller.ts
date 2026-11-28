
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto/create-incident.dto';
import { IncidentsService } from './incidents.service';

@ApiTags('Incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer la liste des incidents' })
  @ApiResponse({ status: 200, description: 'Liste des incidents récupérée avec succès' })
  findAll() {
    return this.incidentsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Créer un incident' })
  @ApiResponse({ status: 201, description: 'Incident créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }
}
