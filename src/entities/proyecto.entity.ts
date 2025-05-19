import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Profesor } from './profesor.entity';
import { Evaluacion } from './evaluacion.entity';

@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  titulo: string;

  @Column()
  area: string;

  @Column()
  presupuesto: number;

  @Column()
  notaFinal: number;

  @Column()
  estado: number;

  @Column()
  fechaInicio: string;

  @Column()
  fechaFin: string;

  @ManyToOne(() => Estudiante, estudiante => estudiante.proyectosLiderados)
  lider: Estudiante;

  @OneToMany(() => Evaluacion, evaluacion => evaluacion.proyecto)
  evaluaciones: Evaluacion[];

  @ManyToMany(() => Profesor)
  @JoinTable()
  mentores: Profesor[];
}