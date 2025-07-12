import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Geoloc } from './geoloc.entity';
import { GeolocData } from './interfaces/geoloc-data.interface';

@Injectable()
export class GeolocService {
  constructor(
    @InjectRepository(Geoloc)
    private readonly geolocRepository: Repository<Geoloc>,
  ) {}

  async updatePosition(
    technicienId: string,
    latitude: number,
    longitude: number,
  ): Promise<GeolocData> {
    let geoloc = await this.geolocRepository.findOne({ where: { technicienId } });

    if (!geoloc) {
      geoloc = this.geolocRepository.create({ technicienId, latitude, longitude });
    } else {
      geoloc.latitude = latitude;
      geoloc.longitude = longitude;
    }

    const saved = await this.geolocRepository.save(geoloc);

    return {
      technicienId: saved.technicienId,
      latitude: saved.latitude,
      longitude: saved.longitude,
    };
  }

  async getPosition(technicienId: string): Promise<GeolocData | null> {
    return this.geolocRepository.findOne({ where: { technicienId } });
  }

  // Nouvelle méthode pour récupérer toutes les positions
  async getAllPositions(): Promise<GeolocData[]> {
    return this.geolocRepository.find();
  }
}
