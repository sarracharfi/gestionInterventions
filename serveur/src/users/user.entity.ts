import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
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

  @Column({
    type: 'varchar',
    enum: ['admin', 'technicien', 'client', 'comptable'],
    default: 'client'
  })
  role: string;


  @Column({ nullable: true })
  entreprise?: string;

  @Column({ nullable: true })
  specialite?: string;

  @Column({ nullable: true })
  codeComptable?: string;

  @Column({ nullable: true })
  matricule?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullName(): string {
    return `${this.prenom} ${this.nom}`;
  }
}