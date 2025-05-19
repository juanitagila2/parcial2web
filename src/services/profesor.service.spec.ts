import { Test, TestingModule } from '@nestjs/testing';
import { ProfesorService } from './profesor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profesor } from '../entities/profesor.entity';
import { Proyecto } from '../entities/proyecto.entity';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let profesorRepo: Repository<Profesor>;
  let evaluacionRepo: Repository<Evaluacion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfesorService,
        { provide: getRepositoryToken(Profesor), useClass: Repository },
        { provide: getRepositoryToken(Proyecto), useClass: Repository },
        { provide: getRepositoryToken(Evaluacion), useClass: Repository },
      ],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    profesorRepo = module.get<Repository<Profesor>>(getRepositoryToken(Profesor));
    evaluacionRepo = module.get<Repository<Evaluacion>>(getRepositoryToken(Evaluacion));
  });

  // crearProfesor
  it('debe crear un profesor (caso positivo)', async () => {
    const profesorData = {
      cedula: 123,
      nombre: 'Ana',
      departamento: 'Matemáticas',
      extension: 12345,
      esParEvaluado: false,
    };
    jest.spyOn(profesorRepo, 'create').mockReturnValue(profesorData as Profesor);
    jest.spyOn(profesorRepo, 'save').mockResolvedValue(profesorData as Profesor);

    const result = await service.crearProfesor(profesorData);
    expect(result).toEqual(profesorData);
  });

  it('debe lanzar error si la extensión no está definida (caso negativo)', async () => {
    const profesorData = {
      cedula: 123,
      nombre: 'Ana',
      departamento: 'Matemáticas',
      esParEvaluado: false,
    };
    await expect(service.crearProfesor(profesorData)).rejects.toThrow(BadRequestException);
  });

  it('debe lanzar error si la extensión no tiene 5 dígitos (caso negativo)', async () => {
    const profesorData = {
      cedula: 123,
      nombre: 'Ana',
      departamento: 'Matemáticas',
      extension: 1234,
      esParEvaluado: false,
    };
    await expect(service.crearProfesor(profesorData)).rejects.toThrow(BadRequestException);
  });

  // asignarEvaluador
  it('debe asignar un evaluador a una evaluación (caso positivo)', async () => {
    const profesor = { id: 1 } as Profesor;
    const evaluacion = { id: 2 } as Evaluacion;

    jest.spyOn(profesorRepo, 'findOne').mockResolvedValue(profesor);
    jest.spyOn(evaluacionRepo, 'count').mockResolvedValue(2);
    jest.spyOn(evaluacionRepo, 'findOne').mockResolvedValue(evaluacion);
    jest.spyOn(evaluacionRepo, 'save').mockResolvedValue({ ...evaluacion, profesor });

    const result = await service.asignarEvaluador(1, 2);
    expect(result.profesor).toEqual(profesor);
  });

  it('debe lanzar error si el profesor no existe (caso negativo)', async () => {
    jest.spyOn(profesorRepo, 'findOne').mockResolvedValue(null);

    await expect(service.asignarEvaluador(1, 2)).rejects.toThrow(NotFoundException);
  });

  it('debe lanzar error si el profesor ya tiene 3 evaluaciones activas (caso negativo)', async () => {
    const profesor = { id: 1 } as Profesor;
    jest.spyOn(profesorRepo, 'findOne').mockResolvedValue(profesor);
    jest.spyOn(evaluacionRepo, 'count').mockResolvedValue(3);

    await expect(service.asignarEvaluador(1, 2)).rejects.toThrow(ConflictException);
  });

  it('debe lanzar error si la evaluación no existe (caso negativo)', async () => {
    const profesor = { id: 1 } as Profesor;
    jest.spyOn(profesorRepo, 'findOne').mockResolvedValue(profesor);
    jest.spyOn(evaluacionRepo, 'count').mockResolvedValue(1);
    jest.spyOn(evaluacionRepo, 'findOne').mockResolvedValue(null);

    await expect(service.asignarEvaluador(1, 2)).rejects.toThrow(NotFoundException);
  });
});