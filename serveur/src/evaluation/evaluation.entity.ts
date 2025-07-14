import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Client } from '../client/client.entity';
import { Technicien } from '../technicien/technicien.entity';

@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 1 })
  note: number;

  @Column({ type: 'text', nullable: true })
  commentaire: string | null;

  @CreateDateColumn()
  dateEvaluation: Date;

  @ManyToOne(() => Client, (client) => client.evaluations, { eager: true })
  client: Client;

  @ManyToOne(() => Technicien, (technicien) => technicien.evaluations, { eager: true })
  technicien: Technicien;
}
