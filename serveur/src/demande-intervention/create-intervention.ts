import { IsNotEmpty, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { InterventionStatus } from './demande.entity';
 
export class CreateDemandeInterventionDto {
  @IsNotEmpty()
  @IsString()
  titre: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(InterventionStatus)
  status?: InterventionStatus;

  @IsOptional()
  @IsDateString()
  dateIntervention?: string;  

  @IsNotEmpty()
  clientId: string;
}
