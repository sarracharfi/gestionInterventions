import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Materiel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  categorie: string;

  @Column()
  technicienId: string;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ nullable: true })
  description: string;

  @Column('int', { nullable: true })
  quantite: number;

  @Column({ nullable: true })
  etat: string;
}
