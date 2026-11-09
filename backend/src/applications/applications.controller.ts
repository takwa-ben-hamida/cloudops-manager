import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto/create-application.dto';

@Controller('applications')
export class ApplicationsController {

  @Get()
  findAll() {
    return {
      message: 'Liste des applications'
    };
  }

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return {
      message: 'Application créée avec succès',
      data: createApplicationDto
    };
  }
}