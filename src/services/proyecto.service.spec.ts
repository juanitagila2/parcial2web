import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoService } from './proyecto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Proyecto } from '../entities/proyecto.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Profesor } from '../entities/profesor.entity';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let proyectoRepo: Repository<Proyecto>;
  let estudianteRepo: Repository<Estudiante>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoService,
        { provide: getRepositoryToken(Proyecto), useClass: Repository },
        { provide: getRepositoryToken(Estudiante), useClass: Repository },
        { provide: getRepositoryToken(Profesor), useClass: Repository }
      ],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    proyectoRepo = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
    estudianteRepo = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
  });

  // crearProyecto
  it('debe crear un proyecto (caso positivo)', async () => {
    const proyectoData = {
      titulo: 'Proyecto de Investigación en IA 2025',
      area: 'IA',
      presupuesto: 10000,
    };
    const proyecto = { ...proyectoData, id: 1 } as Proyecto;
    jest.spyOn(proyectoRepo, 'create').mockReturnValue(proyecto);
    jest.spyOn(proyectoRepo, 'save').mockResolvedValue(proyecto);

    const result = await service.crearProyecto(proyectoData);
    expect(result).toEqual(proyecto);
  });

  it('debe lanzar error si el título es muy corto (caso negativo)', async () => {
    const proyectoData = {
      titulo: 'Corto',
      area: 'IA',
      presupuesto: 10000,
    };
    await expect(service.crearProyecto(proyectoData)).rejects.toThrow(BadRequestException);
  });

  it('debe lanzar error si el presupuesto es inválido (caso negativo)', async () => {
    const proyectoData = {
      titulo: 'Proyecto de Investigación en IA 2025',
      area: 'IA',
      presupuesto: 0,
    };
    await expect(service.crearProyecto(proyectoData)).rejects.toThrow(BadRequestException);
  });

  // avanzarProyecto
  it('debe avanzar el estado de un proyecto (caso positivo)', async () => {
    const proyecto = {
      id: 1,
      estado: 1,
      titulo: 'Proyecto largo',
      area: 'IA',
      presupuesto: 1000,
      notaFinal: 0,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      lider: {} as any,
      estudiantes: [],
      evaluaciones: [],
      mentores: [],
    } as Proyecto;
    jest.spyOn(proyectoRepo, 'findOne').mockResolvedValue(proyecto);
    jest.spyOn(proyectoRepo, 'save').mockResolvedValue({ ...proyecto, estado: 2 });

    const result = await service.avanzarProyecto(1);
    expect(result.estado).toBe(2);
  });

  it('debe lanzar error si el proyecto no existe al avanzar (caso negativo)', async () => {
    jest.spyOn(proyectoRepo, 'findOne').mockResolvedValue(null);
    await expect(service.avanzarProyecto(1)).rejects.toThrow(NotFoundException);
  });

  // findLider
  it('debe retornar el líder de un proyecto (caso positivo)', async () => {
    const lider = { id: 42, nombre: 'Ana' } as Estudiante;
    const proyecto = {
      id: 1,
      lider,
    } as Proyecto;
    jest.spyOn(proyectoRepo, 'findOne').mockResolvedValue(proyecto);

    const result = await service.findLider(1);
    expect(result).toEqual(lider);
  });

  it('debe lanzar error si el proyecto no existe al buscar líder (caso negativo)', async () => {
    jest.spyOn(proyectoRepo, 'findOne').mockResolvedValue(null);
    await expect(service.findLider(1)).rejects.toThrow(NotFoundException);
  });
});
