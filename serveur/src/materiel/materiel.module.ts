import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materiel } from './materiel.entity';
import { MaterielService } from './materiel.service';
import { MaterielController } from './materiel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Materiel])],
  controllers: [MaterielController],
  providers: [MaterielService],
})
export class MaterielModule {}
