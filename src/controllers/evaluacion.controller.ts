import { Controller, Post, Body } from '@nestjs/common';
import { EvaluacionService } from '../services/evaluacion.service';
import { Evaluacion } from '../entities/evaluacion.entity';

@Controller('evaluacion')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Post()
  async crearEvaluacion(
    @Body() data: { profesorId: number; proyectoId: number; calificacion: number }
  ): Promise<Evaluacion> {
    return this.evaluacionService.crearEvaluacion(data);
  }
}