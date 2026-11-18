import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto/create-application.dto';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {

  @Get()
  @ApiOperation({
    summary: 'Récupérer la liste des applications',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des applications récupérée avec succès',
  })
  findAll() {
    return {
      message: 'Liste des applications',
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Créer une application',
  })
  @ApiResponse({
    status: 201,
    description: 'Application créée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return {
      message: 'Application créée avec succès',
      data: createApplicationDto,
    };
  }
}
