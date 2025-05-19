import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from '../entities/profesor.entity';
import { Proyecto } from '../entities/proyecto.entity';
import { Evaluacion } from '../entities/evaluacion.entity';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(Profesor)
    private profesorRepository: Repository<Profesor>,
    @InjectRepository(Proyecto)
    private proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Evaluacion)
    private evaluacionRepository: Repository<Evaluacion>,
  ) {}

  async crearProfesor(profesorData: Partial<Profesor>): Promise<Profesor> {
    if (profesorData.extension === undefined) {
      throw new BadRequestException('Datos incompletos, ingrese la extensión');
    }
    if (!/^\d{5}$/.test(profesorData.extension.toString())) {
      throw new BadRequestException('La extensión debe tener exactamente 5 dígitos');
    }
    const profesor = this.profesorRepository.create(profesorData);
    return this.profesorRepository.save(profesor);
  }

  async asignarEvaluador(profesorId: number, evaluacionId: number): Promise<Evaluacion> {
    const profesor = await this.profesorRepository.findOne({ where: { id: profesorId } });
    if (!profesor) throw new NotFoundException('Profesor no encontrado');

    const evaluacionesActivas = await this.evaluacionRepository.count({
      where: { profesor: { id: profesorId } }
    });

    if (evaluacionesActivas >= 3) {
      throw new BadRequestException('El profesor ya tiene 3 evaluaciones activas');
    }

    const evaluacion = await this.evaluacionRepository.findOne({ where: { id: evaluacionId } });
    if (!evaluacion) throw new NotFoundException('Evaluación no encontrada');

    evaluacion.profesor = profesor;
    return this.evaluacionRepository.save(evaluacion);
  }
}