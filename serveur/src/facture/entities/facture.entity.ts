import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('factures')
export class Facture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  quantite: number;

  @Column({ length: 10 })
  unite: string; // 'h' pour heure, 'pce' pour pièce, etc.

  @Column('decimal', { precision: 10, scale: 2 })
  prixUnitaire: number;

  @Column('decimal', { precision: 5, scale: 2 })
  tva: number; // 20 pour 20%

  @Column('decimal', { precision: 10, scale: 2 })
  montantHT: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montantTVA: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montantTTC: number;

  @Column({ type: 'date' })
  dateEmission: Date;

  @Column({ default: false })
  estPayee: boolean;

  @Column({ nullable: true })
  clientNom: string;

  @Column({ nullable: true })
  clientAdresse: string;

  @Column({ nullable: true })
  clientCodePostal: string;

  @Column({ nullable: true })
  clientVille: string;

  @Column({ nullable: true })
  codeSuivi: string;

}