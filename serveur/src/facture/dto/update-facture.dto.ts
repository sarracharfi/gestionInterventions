import { PartialType } from '@nestjs/mapped-types';
import { CreateFactureDto } from './create-facture.dto';
import { IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateFactureDto extends PartialType(CreateFactureDto) {
  @IsBoolean()
  @IsOptional()
  estPayee?: boolean;

  @IsNumber()
  @IsOptional()
  montantHT?: number;

  @IsNumber()
  @IsOptional()
  montantTVA?: number;

  @IsNumber()
  @IsOptional()
  montantTTC?: number;
}