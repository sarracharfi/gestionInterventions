import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateTechnicienDto {
  @IsOptional()
  nom?: string;

  @IsOptional()
  prenom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsOptional()
  specialite?: string;

  @IsOptional()
  entreprise?: string;
}
