// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async createAdmin(email: string, password: string, role?: string) {
    const admin = this.adminRepository.create({ email, password, role });
    return this.adminRepository.save(admin);
  }

  findAll() {
    return this.adminRepository.find();
  }

  findOne(id: number) {
    return this.adminRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Admin>) {
    await this.adminRepository.update(id, data);
    return this.findOne(id);
  }

  delete(id: number) {
    return this.adminRepository.delete(id);
  }
}
