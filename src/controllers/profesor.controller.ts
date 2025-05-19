import { Controller, Post, Body, Param } from '@nestjs/common';
import { ProfesorService } from '../services/profesor.service';
import { Profesor } from '../entities/profesor.entity';
import { Evaluacion } from '../entities/evaluacion.entity';

@Controller('profesores')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  async create(@Body() profesor: Partial<Profesor>): Promise<Profesor> {
    return this.profesorService.crearProfesor(profesor);
  }

  @Post(':profesorId/evaluaciones/:evaluacionId')
  async asignarEvaluador(
    @Param('profesorId') profesorId: number,
    @Param('evaluacionId') evaluacionId: number,
  ): Promise<Evaluacion> {
    return this.profesorService.asignarEvaluador(profesorId, evaluacionId);
  }
}