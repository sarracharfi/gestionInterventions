import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materiel } from './materiel.entity';
import { CreateMaterielDto } from './dto/create-materiel.dto';

@Injectable()
export class MaterielService {
  constructor(
    @InjectRepository(Materiel)
    private readonly materielRepo: Repository<Materiel>,
  ) {}

  async create(dto: CreateMaterielDto): Promise<Materiel> {
    const materiel = this.materielRepo.create(dto);
    return await this.materielRepo.save(materiel);
  }

  findAll(): Promise<Materiel[]> {
    return this.materielRepo.find();
  }

  async findOne(id: string): Promise<Materiel> {
    const materiel = await this.materielRepo.findOneBy({ id });
    if (!materiel) {
      throw new Error('Matériel introuvable');
    }
    return materiel;
  }

  async update(id: string, data: Partial<CreateMaterielDto>): Promise<Materiel> {
    await this.materielRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.materielRepo.delete(id);
  }
}
