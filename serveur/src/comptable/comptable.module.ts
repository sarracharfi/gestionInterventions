import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComptableService } from './comptable.service';
import { ComptableController } from './comptable.controller';
import { Comptable } from './comptable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comptable])],
  controllers: [ComptableController],
  providers: [ComptableService],
})
export class ComptableModule {}
