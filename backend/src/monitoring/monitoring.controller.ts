import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto/create-metric.dto';

@Controller('monitoring')
export class MonitoringController {

  @Get()
  findAll() {
    return {
      message: 'Liste des métriques'
    };
  }

  @Post()
  create(@Body() createMetricDto: CreateMetricDto) {
    return {
      message: 'Métrique ajoutée',
      data: createMetricDto
    };
  }
}