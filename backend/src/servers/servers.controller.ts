import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto/create-server.dto';

@Controller('servers')
export class ServersController {

  @Get()
  findAll() {
    return {
      message: 'Liste des serveurs'
    };
  }

  @Post()
  create(@Body() createServerDto: CreateServerDto) {
    return {
      message: 'Serveur créé avec succès',
      data: createServerDto
    };
  }
}