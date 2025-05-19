import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { EstudianteService } from '../services/estudiante.service';
import { Estudiante } from '../entities/estudiante.entity';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async create(@Body() estudiante: Partial<Estudiante>): Promise<Estudiante> {
    return this.estudianteService.crearEstudiante(estudiante);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.estudianteService.eliminarEstudiante(id);
    return { message: `Se eliminó el estudiante con id: ${id}` };
  }
}