import { Evaluation } from 'src/evaluation/evaluation.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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

  @OneToMany(() => Evaluation, (evaluation) => evaluation.technicien)
evaluations: Evaluation[];
}
