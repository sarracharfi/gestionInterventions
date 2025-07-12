import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMaterielDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  categorie: string;

  @IsNotEmpty()
  @IsString()
  technicienId: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  quantite: number;

  @IsNotEmpty()
  @IsString()
  etat: string;

  imagePath?: string;
}
