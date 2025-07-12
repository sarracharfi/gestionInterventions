import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Technicien } from './technicien.entity';
import { CreateTechnicienDto } from './dto/create-technicien.dto';
import { UpdateTechnicienDto } from './dto/update-technicien.dto';

@Injectable()
export class TechnicienService {
  constructor(
    @InjectRepository(Technicien)
    private readonly technicienRepository: Repository<Technicien>,
  ) {}

  // Inscription
  async signUp(createDto: CreateTechnicienDto): Promise<Technicien> {
    const existing = await this.technicienRepository.findOne({
      where: { email: createDto.email },
    });
    if (existing) {
      throw new Error('Email déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    const technicien = this.technicienRepository.create({
      ...createDto,
      password: hashedPassword,
      role: 'technicien',
    });

    return this.technicienRepository.save(technicien);
  }

  // Connexion
  async signIn(email: string, password: string): Promise<Technicien> {
    const technicien = await this.technicienRepository.findOne({ where: { email } });
    if (!technicien) throw new UnauthorizedException('Email ou mot de passe invalide');

    const valid = await bcrypt.compare(password, technicien.password);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe invalide');

    return technicien;
  }

  // Récupérer tous les techniciens
  async findAll(): Promise<Technicien[]> {
    return this.technicienRepository.find();
  }

  // Récupérer un technicien par id
  async findOne(id: string): Promise<Technicien | null> {
    return this.technicienRepository.findOne({ where: { id } });
  }

  // Mise à jour d'un technicien
  async update(id: string, updateDto: UpdateTechnicienDto): Promise<Technicien> {
    const technicien = await this.findOne(id);
    if (!technicien) throw new Error('Technicien non trouvé');

    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    Object.assign(technicien, updateDto);
    return this.technicienRepository.save(technicien);
  }

  // Suppression d'un technicien
  async remove(id: string): Promise<void> {
    const technicien = await this.findOne(id);
    if (!technicien) throw new Error('Technicien non trouvé');
    await this.technicienRepository.delete(id);
  }
}
