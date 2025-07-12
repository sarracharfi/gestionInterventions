// src/demande-intervention/demande-intervention.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeIntervention } from './demande.entity';
import { DemandeInterventionService } from './demande-intervention.service';
import { DemandeInterventionController } from './demande-intervention.controller';
import { Client } from 'src/client/client.entity';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DemandeIntervention, Client]),
    ClientModule, 
  ],
  controllers: [DemandeInterventionController],
  providers: [DemandeInterventionService],
})
export class DemandeInterventionModule {}
