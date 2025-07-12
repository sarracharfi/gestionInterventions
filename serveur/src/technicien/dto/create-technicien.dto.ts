import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTechnicienDto {
  @IsNotEmpty()
  nom: string;

  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  specialite: string;

  @IsNotEmpty()
  entreprise: string;
}
