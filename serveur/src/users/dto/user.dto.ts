import { IsEmail, IsIn, IsNotEmpty, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';

export enum Role {
  ADMIN = 'admin',
  TECHNICIEN = 'technicien',
  CLIENT = 'client',
  COMPTABLE = 'comptable',
}

export class CreateUserDto {
  @IsNotEmpty()
  nom: string;

  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsIn([Role.ADMIN, Role.TECHNICIEN, Role.CLIENT, Role.COMPTABLE], { 
    message: 'Rôle invalide. Choisissez parmi: admin, technicien, client, comptable' 
  })
  role: Role;

  @IsOptional()
  @IsPhoneNumber('TN', { message: 'Le numéro de téléphone doit être valide au format tunisien' })
  telephone?: string;

  // Champ pour les clients
  @IsOptional()
  entreprise?: string;

  // Champ pour les techniciens
  @IsOptional()
  specialite?: string;

  // Champ spécifique pour les comptables
  @IsOptional()
  codeComptable?: string;

  // Champ pour les techniciens et comptables
  @IsOptional()
  matricule?: string;
}
