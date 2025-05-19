import { Controller, Post, Param, Body, Get, ParseIntPipe } from '@nestjs/common';
import { ProyectoService } from '../services/proyecto.service';
import { Proyecto } from '../entities/proyecto.entity';
import { Estudiante } from '../entities/estudiante.entity';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  async create(@Body() proyecto: Partial<Proyecto>): Promise<Proyecto> {
    return this.proyectoService.crearProyecto(proyecto);
  }

  @Post(':id/avanzar')
  async avanzar(@Param('id', ParseIntPipe) id: number): Promise<Proyecto> {
    return this.proyectoService.avanzarProyecto(id);
  }

  @Get(':id/lider')
  async findLider(@Param('id', ParseIntPipe) id: number): Promise<Estudiante> {
    return this.proyectoService.findLider(id);
  }
}
