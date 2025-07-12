import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandeInterventionDto } from '../create-intervention';
 
export class UpdateDemandeInterventionDto extends PartialType(CreateDemandeInterventionDto) {}
