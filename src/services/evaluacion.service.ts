import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Profesor } from '../entities/profesor.entity';
import { Proyecto } from '../entities/proyecto.entity';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(Evaluacion)
    private evaluacionRepository: Repository<Evaluacion>,
    @InjectRepository(Profesor)
    private profesorRepository: Repository<Profesor>,
    @InjectRepository(Proyecto)
    private proyectoRepository: Repository<Proyecto>,
  ) {}

  async crearEvaluacion(data: { profesorId: number, proyectoId: number, calificacion: number }): Promise<Evaluacion> {
    const profesor = await this.profesorRepository.findOne({ where: { id: data.profesorId } });
    const proyecto = await this.proyectoRepository.findOne({ where: { id: data.proyectoId }, relations: ['mentores'] });
    if (!profesor || !proyecto) throw new NotFoundException('Profesor o Proyecto no encontrado');

    if (proyecto.mentores.some(mentor => mentor.id === profesor.id)) {
      throw new BadRequestException('El evaluador no puede ser mentor del proyecto');
    }
    if (data.calificacion < 0 || data.calificacion > 5) {
      throw new BadRequestException('La calificación debe estar entre 0 y 5');
    }

    const evaluacion = this.evaluacionRepository.create({
      profesor: profesor,
      proyecto: proyecto,
    });
    return this.evaluacionRepository.save(evaluacion);
  }
}