import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGeolocDto {
  @IsString()
  @IsNotEmpty()
  technicienId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
