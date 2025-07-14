import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEvaluationDto {
  @IsNotEmpty({ message: "Nom du client requis" })
  @IsString()
  clientNom: string;

  @IsNotEmpty({ message: "Prénom du client requis" })
  @IsString()
  clientPrenom: string;

  @IsNotEmpty({ message: "Nom du technicien requis" })
  @IsString()
  technicienNom: string;

  @IsNotEmpty({ message: "Prénom du technicien requis" })
  @IsString()
  technicienPrenom: string;

  @IsNotEmpty()
  @IsNumber()
  note: number;

  @IsOptional()
  @IsString()
  commentaire?: string;
}
