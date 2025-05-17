import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../entities/proyecto.entity';
import { Estudiante } from '../entities/estudiante.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
  ) {}

  async crearProyecto(proyectoData: Partial<Proyecto>): Promise<Proyecto> {
    if (!proyectoData.titulo || proyectoData.titulo.length <= 15) {
      throw new BadRequestException('El título debe tener más de 15 caracteres');
    }
    if (proyectoData.presupuesto === undefined || proyectoData.presupuesto <= 0) {
      throw new BadRequestException('El presupuesto debe ser mayor a 0');
    }
    const proyecto = this.proyectoRepository.create(proyectoData);
    return this.proyectoRepository.save(proyecto);
  }

  async avanzarProyecto(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    if (proyecto.estado >= 4) {
      throw new ConflictException('El proyecto ya está en su estado máximo');
    }
    proyecto.estado += 1;
    return this.proyectoRepository.save(proyecto);
  }

  async findAllEstudiantes(proyectoId: number): Promise<Estudiante[]> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: proyectoId },
      relations: ['estudiantes'],
    });
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    return proyecto.estudiantes;
  }
}