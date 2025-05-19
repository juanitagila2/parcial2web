import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Estudiante } from './entities/estudiante.entity';
import { Proyecto } from './entities/proyecto.entity';
import { Profesor } from './entities/profesor.entity';
import { Evaluacion } from './entities/evaluacion.entity';
import { EstudianteController } from './controllers/estudiante.controller';
import { EstudianteService } from './services/estudiante.service';
import { ProyectoController } from './controllers/proyecto.controller';
import { ProyectoService } from './services/proyecto.service';
import { ProfesorController } from './controllers/profesor.controller';
import { ProfesorService } from './services/profesor.service';
import { EvaluacionController } from './controllers/evaluacion.controller';
import { EvaluacionService } from './services/evaluacion.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial',
      entities: [Estudiante, Proyecto, Profesor, Evaluacion],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Estudiante, Proyecto, Profesor, Evaluacion]),
  ],
  controllers: [
    AppController,
    EstudianteController,
    ProyectoController,
    ProfesorController,
    EvaluacionController,
  ],
  providers: [
    AppService,
    EstudianteService,
    ProyectoService,
    ProfesorService,
    EvaluacionService,
  ],
})
export class AppModule {}
