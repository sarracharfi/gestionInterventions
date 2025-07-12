import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Geoloc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  technicienId: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;
}
