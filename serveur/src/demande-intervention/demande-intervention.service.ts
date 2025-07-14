import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from '../client/client.entity';
import { DemandeIntervention } from './demande.entity';
import { InterventionStatus } from './demande.entity';
import { CreateDemandeInterventionDto } from './create-intervention';
import { UpdateDemandeInterventionDto } from './dto/update-intervention';

import { DemandeInterventionGateway } from './demande-intervention.gateway';

@Injectable()
export class DemandeInterventionService {
  constructor(
    @InjectRepository(DemandeIntervention)
    private demandeRepository: Repository<DemandeIntervention>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    private readonly gateway: DemandeInterventionGateway,
  ) {}

  async create(createDto: CreateDemandeInterventionDto): Promise<DemandeIntervention> {
    const client = await this.clientRepository.findOne({ where: { id: createDto.clientId } });
    if (!client) throw new NotFoundException('Client non trouvé');

    const demande = this.demandeRepository.create({
      titre: createDto.titre,
      description: createDto.description,
      status: createDto.status ?? InterventionStatus.PENDING,
      dateIntervention: createDto.dateIntervention ? new Date(createDto.dateIntervention) : undefined,
      client,
    });
    return this.demandeRepository.save(demande);
  }

  async findAll(): Promise<DemandeIntervention[]> {
    return this.demandeRepository.find({ relations: ['client'] });
  }

  async findOne(id: string): Promise<DemandeIntervention> {
    const demande = await this.demandeRepository.findOne({ where: { id }, relations: ['client'] });
    if (!demande) throw new NotFoundException(`Demande #${id} non trouvée`);
    return demande;
  }

  async update(id: string, updateDto: UpdateDemandeInterventionDto): Promise<DemandeIntervention> {
    const demande = await this.findOne(id);

    if (updateDto.clientId) {
      const client = await this.clientRepository.findOne({ where: { id: updateDto.clientId } });
      if (!client) throw new NotFoundException('Client non trouvé');
      demande.client = client;
    }

    if (updateDto.dateIntervention) {
      demande.dateIntervention = new Date(updateDto.dateIntervention);
    }

    Object.assign(demande, {
      titre: updateDto.titre ?? demande.titre,
      description: updateDto.description ?? demande.description,
      status: updateDto.status ?? demande.status,
    });

    const saved = await this.demandeRepository.save(demande);

    // Émission socket pour notifier changement de statut
    this.gateway.sendStatusUpdate(saved.id, saved.status, saved.titre);

    return saved;
  }

  async remove(id: string): Promise<void> {
    const demande = await this.findOne(id);
    await this.demandeRepository.remove(demande);
  }

  async changeStatus(id: string, status: InterventionStatus): Promise<DemandeIntervention> {
    const demande = await this.findOne(id);
    demande.status = status;
    const saved = await this.demandeRepository.save(demande);

    // Émission socket pour notifier changement de statut
    this.gateway.sendStatusUpdate(saved.id, saved.status, saved.titre);

    return saved;
  }
}
