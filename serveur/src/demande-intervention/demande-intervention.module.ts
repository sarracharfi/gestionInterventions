import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DemandeIntervention } from './demande.entity';
import { Client } from '../client/client.entity';

import { DemandeInterventionService } from './demande-intervention.service';
import { DemandeInterventionController } from './demande-intervention.controller';
import { DemandeInterventionGateway } from './demande-intervention.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([DemandeIntervention, Client]),  
  ],
  controllers: [DemandeInterventionController],
  providers: [DemandeInterventionService, DemandeInterventionGateway],
  exports: [DemandeInterventionService, DemandeInterventionGateway], 
})
export class DemandeInterventionModule {}
