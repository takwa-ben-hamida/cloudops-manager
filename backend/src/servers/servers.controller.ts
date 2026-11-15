import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto/create-server.dto';

@ApiTags('Servers')
@Controller('servers')
export class ServersController {

  @Get()
  @ApiOperation({
    summary: 'Récupérer la liste des serveurs',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des serveurs récupérée avec succès',
  })
  findAll() {
    return {
      message: 'Liste des serveurs',
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Créer un serveur',
  })
  @ApiResponse({
    status: 201,
    description: 'Serveur créé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  create(@Body() createServerDto: CreateServerDto) {
    return {
      message: 'Serveur créé avec succès',
      data: createServerDto,
    };
  }
}