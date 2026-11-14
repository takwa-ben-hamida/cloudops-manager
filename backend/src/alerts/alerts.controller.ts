import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto/create-alert.dto';

@Controller('alerts')
export class AlertsController {

  @Get()
  findAll() {
    return {
      message: 'Liste des alertes'
    };
  }

  @Post()
  create(@Body() createAlertDto: CreateAlertDto) {
    return {
      message: 'Alerte créée',
      data: createAlertDto
    };
  }
}