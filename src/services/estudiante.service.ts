import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../entities/estudiante.entity';
import { Proyecto } from '../entities/proyecto.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Proyecto)
    private proyectoRepository: Repository<Proyecto>,
  ) {}

  async crearEstudiante(estudianteData: Partial<Estudiante>): Promise<Estudiante> {
    if (
      estudianteData.promedio === undefined ||
      estudianteData.semestre === undefined
    ) {
      throw new BadRequestException('Datos incompletos');
    }
    if (estudianteData.promedio <= 3.2) {
      throw new BadRequestException('El promedio debe ser mayor a 3.2');
    }
    if (estudianteData.semestre < 4) {
      throw new BadRequestException('El semestre debe ser mayor o igual a 4');
    }
    const estudiante = this.estudianteRepository.create(estudianteData);
    return this.estudianteRepository.save(estudiante);
  }

  async eliminarEstudiante(id: number): Promise<void> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['proyectosLiderados'],
    });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');

    const proyectosActivos = estudiante.proyectosLiderados.filter(
      proyecto => proyecto.estado === 1 // estado activo
    );

    if (proyectosActivos.length > 0) {
      throw new ConflictException('No se puede eliminar un estudiante con proyectos activos');
    }

    await this.estudianteRepository.delete(id);
  }

}
