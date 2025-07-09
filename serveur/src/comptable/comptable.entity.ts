import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('comptables')
export class Comptable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;  

  @Column({ default: 'comptable' })
  role: string;
}
