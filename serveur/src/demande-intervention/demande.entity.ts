import { Client } from 'src/client/client.entity'; // Chemin relatif ou alias correct
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

export enum InterventionStatus {
  PENDING = 'en_attente',
  CONFIRMED = 'confirmée',
  COMPLETED = 'terminée',
  CANCELLED = 'annulée',
}

@Entity()
export class DemandeIntervention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titre: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: InterventionStatus,
    default: InterventionStatus.PENDING,
  })
  status: InterventionStatus;

  @Column({ type: 'date', nullable: true })
  dateIntervention?: Date;

  @ManyToOne(() => Client, client => client.demandes, { eager: true })
  client: Client;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
