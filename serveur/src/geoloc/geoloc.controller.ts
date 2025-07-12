import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GeolocService } from './geoloc.service';
import { CreateGeolocDto } from './dto/create-geoloc.dto';
import { GeolocData } from './interfaces/geoloc-data.interface';

@Controller('geoloc')
export class GeolocController {
  constructor(private readonly geolocService: GeolocService) {}

  @Post()
  async save(@Body() dto: CreateGeolocDto): Promise<GeolocData> {
    return await this.geolocService.updatePosition(dto.technicienId, dto.latitude, dto.longitude);
  }

  @Get(':technicienId')
  async get(@Param('technicienId') technicienId: string): Promise<GeolocData | { message: string }> {
    const data = await this.geolocService.getPosition(technicienId);
    if (!data) {
      return { message: 'Position non trouvée pour ce technicien' };
    }
    return data;
  }

  // Nouvelle route pour récupérer toutes les positions
  @Get()
  async getAll(): Promise<GeolocData[]> {
    return await this.geolocService.getAllPositions();
  }
}
