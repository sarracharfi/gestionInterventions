import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comptable } from './comptable.entity';

@Injectable()
export class ComptableService {
  constructor(
    @InjectRepository(Comptable)
    private readonly comptableRepo: Repository<Comptable>,
  ) {}

  async create(data: Partial<Comptable>) {
    try {
      return await this.comptableRepo.save(data);
    } catch (error) {
      console.error('Erreur lors de la création du comptable :', error.message);
      throw error;
    }
  }

  async findAll() {
    return await this.comptableRepo.find();
  }

  async findOne(id: number) {
    return await this.comptableRepo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Comptable>) {
    await this.comptableRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.comptableRepo.delete(id);
  }
}
