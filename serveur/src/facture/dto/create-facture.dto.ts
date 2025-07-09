import { IsNotEmpty, IsNumber, IsPositive, IsIn, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateFactureDto {
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  quantite: number;

  @IsIn(['h', 'pce', 'j', 'm'])
  unite: string;

  @IsNumber()
  @IsPositive()
  prixUnitaire: number;

  @IsNumber()
  @IsPositive()
  @IsIn([5.5, 10, 20])
  tva: number;

  @IsDateString()
  @IsOptional()
  dateEmission?: Date;

  @IsBoolean()
  @IsOptional()
  estPayee?: boolean;

  // Champs calculés (optionnels en création)
  @IsOptional()
  @IsNumber()
  montantHT?: number;

  @IsOptional()
  @IsNumber()
  montantTVA?: number;

  @IsOptional()
  @IsNumber()
  montantTTC?: number;

  // Informations client
  @IsOptional()
  clientNom?: string;

  @IsOptional()
  clientAdresse?: string;

  @IsOptional()
  clientCodePostal?: string;

  @IsOptional()
  clientVille?: string;
}