
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto/create-application.dto';

import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/enums';

@ApiTags('Applications')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Récupérer la liste des applications',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des applications récupérée avec succès',
  })
  findAll() {
    return this.applicationsService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN, Role.DEVOPS)
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
  create(@Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(dto);
  }
}
