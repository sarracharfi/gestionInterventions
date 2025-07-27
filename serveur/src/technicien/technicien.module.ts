import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technicien } from './technicien.entity';
import { TechnicienService } from './technicien.service';
import { TechnicienController } from './technicien.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Technicien])],
  controllers: [TechnicienController],
  providers: [TechnicienService],
  exports: [TechnicienService], // ⚠️ nécessaire pour AdminModule
})
export class TechnicienModule {}
