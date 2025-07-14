import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Evaluation } from './evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { Client } from '../client/client.entity';
import { Technicien } from '../technicien/technicien.entity';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(Evaluation)
    private evaluationRepo: Repository<Evaluation>,

    @InjectRepository(Client)
    private clientRepo: Repository<Client>,

    @InjectRepository(Technicien)
    private technicienRepo: Repository<Technicien>,
  ) {}

  private async findClient(nom?: string, prenom?: string): Promise<Client> {
    if (!nom || !prenom) throw new BadRequestException('Nom et prénom du client requis');
    const client = await this.clientRepo.findOne({
      where: { nom: ILike(nom.trim()), prenom: ILike(prenom.trim()) },
    });
    if (!client) throw new NotFoundException('Client non trouvé');
    return client;
  }

  private async findTechnicien(nom?: string, prenom?: string): Promise<Technicien> {
    if (!nom || !prenom) throw new BadRequestException('Nom et prénom du technicien requis');
    const technicien = await this.technicienRepo.findOne({
      where: { nom: ILike(nom.trim()), prenom: ILike(prenom.trim()) },
    });
    if (!technicien) throw new NotFoundException('Technicien non trouvé');
    return technicien;
  }

  async create(dto: CreateEvaluationDto): Promise<Evaluation> {
    const client = await this.findClient(dto.clientNom, dto.clientPrenom);
    const technicien = await this.findTechnicien(dto.technicienNom, dto.technicienPrenom);

    const evaluation = this.evaluationRepo.create({
      note: dto.note,
      commentaire: dto.commentaire ?? null,
      client,
      technicien,
    });

    return this.evaluationRepo.save(evaluation);
  }

  async findAll(): Promise<Evaluation[]> {
    return this.evaluationRepo.find();
  }

  async findOne(id: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepo.findOne({ where: { id } });
    if (!evaluation) throw new NotFoundException('Évaluation non trouvée');
    return evaluation;
  }

  async update(id: string, dto: CreateEvaluationDto): Promise<Evaluation> {
    const evaluation = await this.evaluationRepo.findOne({ where: { id } });
    if (!evaluation) throw new NotFoundException('Évaluation non trouvée');

    const client = await this.findClient(dto.clientNom, dto.clientPrenom);
    const technicien = await this.findTechnicien(dto.technicienNom, dto.technicienPrenom);

    evaluation.note = dto.note;
    evaluation.commentaire = dto.commentaire ?? null;
    evaluation.client = client;
    evaluation.technicien = technicien;

    return this.evaluationRepo.save(evaluation);
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.evaluationRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Évaluation non trouvée');
    return { message: 'Évaluation supprimée avec succès' };
  }
}
