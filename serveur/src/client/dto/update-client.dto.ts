import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateClientDto {
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
  telephone?: string;

  @IsOptional()
  ville?: string;

  @IsOptional()
  adresse?: string;
}
