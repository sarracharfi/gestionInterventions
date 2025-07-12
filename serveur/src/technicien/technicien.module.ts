import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicienService } from './technicien.service';
import { TechnicienController } from './technicien.controller';
import { Technicien } from './technicien.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Technicien])],
  providers: [TechnicienService],
  controllers: [TechnicienController],
})
export class TechnicienModule {}
