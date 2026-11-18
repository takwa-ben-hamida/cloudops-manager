import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { EnvironmentsService } from './environments.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/enums';

@UseGuards(AuthGuard, RolesGuard)
@Controller('environments')
export class EnvironmentsController {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DEVOPS)
  create(@Body() dto: CreateEnvironmentDto) {
    return this.environmentsService.create(dto);
  }

  // GET /environments  ou  GET /environments?projectId=1
  @Get()
  findAll(
    @Query('projectId', new ParseIntPipe({ optional: true }))
    projectId?: number,
  ) {
    return this.environmentsService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.environmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DEVOPS)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEnvironmentDto,
  ) {
    return this.environmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DEVOPS)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.environmentsService.remove(id);
  }
}
