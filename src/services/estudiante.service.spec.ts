import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Estudiante } from '../entities/estudiante.entity';
import { Proyecto } from '../entities/proyecto.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepo: Repository<Estudiante>;
  let proyectoRepo: Repository<Proyecto>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
        {
          provide: getRepositoryToken(Estudiante),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Proyecto),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepo = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
    proyectoRepo = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
  });

  // crearEstudiante
  it('debe crear un estudiante (caso positivo)', async () => {
    const estudianteData = {
      cedula: 123,
      nombre: 'Juan',
      semestre: 5,
      programa: 'Ingeniería',
      promedio: 4.0,
    };
    jest.spyOn(estudianteRepo, 'create').mockReturnValue(estudianteData as Estudiante);
    jest.spyOn(estudianteRepo, 'save').mockResolvedValue(estudianteData as Estudiante);

    const result = await service.crearEstudiante(estudianteData);
    expect(result).toEqual(estudianteData);
  });

  it('debe lanzar error si el promedio es menor o igual a 3.2 (caso negativo)', async () => {
    const estudianteData = {
      cedula: 123,
      nombre: 'Juan',
      semestre: 5,
      programa: 'Ingeniería',
      promedio: 3.0,
    };
    await expect(service.crearEstudiante(estudianteData)).rejects.toThrow(BadRequestException);
  });

  it('debe lanzar error si el semestre es menor a 4 (caso negativo)', async () => {
    const estudianteData = {
      cedula: 123,
      nombre: 'Juan',
      semestre: 2,
      programa: 'Ingeniería',
      promedio: 4.0,
    };
    await expect(service.crearEstudiante(estudianteData)).rejects.toThrow(BadRequestException);
  });

  // eliminarEstudiante
  it('debe eliminar un estudiante sin proyectos activos (caso positivo)', async () => {
    const estudiante = {
      id: 1,
      cedula: 123,
      nombre: 'Juan',
      semestre: 5,
      programa: 'Ingeniería',
      promedio: 4.0,
      proyectos: [],
      proyectosLiderados: [],
    } as Estudiante;
    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(estudiante);
    jest.spyOn(proyectoRepo, 'count').mockResolvedValue(0);
    jest.spyOn(estudianteRepo, 'delete').mockResolvedValue({} as any);

    await expect(service.eliminarEstudiante(1)).resolves.toBeUndefined();
  });

  it('debe lanzar error si el estudiante no existe (caso negativo)', async () => {
    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(null);
    await expect(service.eliminarEstudiante(1)).rejects.toThrow(NotFoundException);
  });

  it('debe lanzar error si el estudiante tiene proyectos activos (caso negativo)', async () => {
    const estudiante = {
      id: 1,
      cedula: 123,
      nombre: 'Juan',
      semestre: 5,
      programa: 'Ingeniería',
      promedio: 4.0,
      proyectosLiderados: [
        { estado: 1 }  // <-- proyecto activo simulado
      ],
    } as Estudiante;

    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(estudiante);
    // No necesitas mockear proyectoRepo.count ni estudianteRepo.delete porque no se llegan a usar en este caso

    await expect(service.eliminarEstudiante(1)).rejects.toThrow(ConflictException);
  });


});