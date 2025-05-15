import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Proyecto } from './proyecto.entity';
import { Evaluacion } from './evaluacion.entity';

@Entity()
export class Profesor {
  @Column()
  cedula: number; 
  
  @Column()
  nombre: string;
  
  @Column()
  departamento: string;
  
  @Column()
  extension: number;

  @Column()
  esParEvaluado: boolean;

  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(() => Evaluacion, evaluacion => evaluacion.profesor)
  evaluaciones: Evaluacion[];
}