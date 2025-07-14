import { DemandeIntervention } from 'src/demande-intervention/demande.entity';
import { Evaluation } from 'src/evaluation/evaluation.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column() // password obligatoire, non nullable
  password: string;

  @Column()
  telephone: string;

  @Column({ nullable: true })
  ville?: string;

  @Column({ nullable: true })
  adresse?: string;

  @Column({ default: 'client' })
  role: string;

  @OneToMany(() => DemandeIntervention, demande => demande.client)
  demandes: DemandeIntervention[];

  @OneToMany(() => Evaluation, (evaluation) => evaluation.client)
evaluations: Evaluation[];
}
