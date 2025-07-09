import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  prenom: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsPhoneNumber('FR')
  telephone?: string;

  @IsOptional()
  @IsString()
  entreprise?: string;

  @IsOptional()
  @IsString()
  specialite?: string;

  @IsOptional()
  @IsString()
  codeComptable?: string;

  @IsOptional()
  @IsString()
  matricule?: string;
}