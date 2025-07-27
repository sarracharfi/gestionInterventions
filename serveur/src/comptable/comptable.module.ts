import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comptable } from './comptable.entity';
import { ComptableService } from './comptable.service';
import { ComptableController } from './comptable.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comptable])],
  controllers: [ComptableController],
  providers: [ComptableService],
  exports: [ComptableService], // ⚠️ nécessaire pour AdminModule
})
export class ComptableModule {}
