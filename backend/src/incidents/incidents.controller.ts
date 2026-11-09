import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto/create-incident.dto';

@Controller('incidents')
export class IncidentsController {

  @Get()
  findAll() {
    return {
      message: 'Liste des incidents'
    };
  }

  @Post()
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return {
      message: 'Incident créé',
      data: createIncidentDto
    };
  }
}