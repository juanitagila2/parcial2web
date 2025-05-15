import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Profesor } from './profesor.entity';
import { Proyecto } from './proyecto.entity';

@Entity()
export class Evaluacion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Profesor, profesor => profesor.evaluaciones)
  profesor: Profesor;

  @ManyToOne(() => Proyecto, proyecto => proyecto.evaluaciones)
  proyecto: Proyecto;

}