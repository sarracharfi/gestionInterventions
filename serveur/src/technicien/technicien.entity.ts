import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Technicien {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;  

  @Column()
  specialite: string;

  @Column()
  entreprise: string;

  @Column({ default: 'technicien' })
  role: string;
}
