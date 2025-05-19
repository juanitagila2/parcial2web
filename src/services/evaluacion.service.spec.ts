import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionService } from './evaluacion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Profesor } from '../entities/profesor.entity';
import { Proyecto } from '../entities/proyecto.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  let evaluacionRepo: Repository<Evaluacion>;
  let profesorRepo: Repository<Profesor>;
  let proyectoRepo: Repository<Proyecto>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluacionService,
        { provide: getRepositoryToken(Evaluacion), useClass: Repository },
        { provide: getRepositoryToken(Profesor), useClass: Repository },
        { provide: getRepositoryToken(Proyecto), useClass: Repository },
      ],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
    evaluacionRepo = module.get<Repository<Evaluacion>>(getRepositoryToken(Evaluacion));
    profesorRepo = module.get<Repository<Profesor>>(getRepositoryToken(Profesor));
    proyectoRepo = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
  });

  it('debe crear una evaluación (caso positivo)', async () => {
    const profesor = { id: 1 } as Profesor;
    const proyecto = {
      id: 2,
      titulo: 'Proyecto Test',
      area: 'Ciencias',
      presupuesto: 1000,
      notaFinal: 4.5,
      estado: 1,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      lider: {} as any,
      estudiantes: [],
      evaluaciones: [],
      mentores: [], 
    } as Proyecto;
    const evaluacion = { id: 10, profesor, proyecto } as Evaluacion;

    jest.spyOn(profesorRepo, 'findOne').mockResolvedValue(profesor);
    jest.spyOn(proyectoRepo, 'findOne').mockResolvedValue(proyecto);
    jest.spyOn(evaluacionRepo, 'create').mockReturnValue(evaluacion);
    jest.spyOn(evaluacionRepo, 'save').mockResolvedValue(evaluacion);

    const result = await service.crearEvaluacion({ profesorId: 1, proyectoId: 2, calificacion: 4 });
    expect(result).toEqual(evaluacion);
  });

  it('debe lanzar error si el profesor o proyecto no existe (caso negativo)', async () => {
    jest.spyOn(profesorRepo, 'findOne').mockResolvedValue(null);
    jest.spyOn(proyectoRepo, 'findOne').mockResolvedValue(null);

    await expect(
      service.crearEvaluacion({ profesorId: 1, proyectoId: 2, calificacion: 4 })
    ).rejects.toThrow(NotFoundException);
  });

  it('debe lanzar error si el profesor es mentor del proyecto (caso negativo)', async () => {
    const profesor = { id: 1 } as Profesor;
    const proyecto = { id: 2, mentores: [{ id: 1 } as Profesor] } as Proyecto;

    jest.spyOn(profesorRepo, 'findOne').mockResolvedValue(profesor);
    jest.spyOn(proyectoRepo, 'findOne').mockResolvedValue(proyecto);

    await expect(
      service.crearEvaluacion({ profesorId: 1, proyectoId: 2, calificacion: 4 })
    ).rejects.toThrow(BadRequestException);
  });

  it('debe lanzar error si la calificación está fuera de rango (caso negativo)', async () => {
    const profesor = { id: 1 } as Profesor;
    const proyecto = {
      id: 2,
      titulo: 'Proyecto Test',
      area: 'Ciencias',
      presupuesto: 1000,
      notaFinal: 4.5,
      estado: 1,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      lider: {} as any,
      estudiantes: [],
      evaluaciones: [],
      mentores: [],
    } as Proyecto;

    jest.spyOn(profesorRepo, 'findOne').mockResolvedValue(profesor);
    jest.spyOn(proyectoRepo, 'findOne').mockResolvedValue(proyecto);

    await expect(
      service.crearEvaluacion({ profesorId: 1, proyectoId: 2, calificacion: 6 })
    ).rejects.toThrow(BadRequestException);
  });
});