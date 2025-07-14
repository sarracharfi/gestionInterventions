import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluation } from './evaluation.entity';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { Client } from '../client/client.entity';
import { Technicien } from '../technicien/technicien.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluation, Client, Technicien])],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
