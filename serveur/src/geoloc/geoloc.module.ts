import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Geoloc } from './geoloc.entity';
import { GeolocService } from './geoloc.service';
import { GeolocController } from './geoloc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Geoloc])],
  providers: [GeolocService],
  controllers: [GeolocController],
})
export class GeolocModule {}
