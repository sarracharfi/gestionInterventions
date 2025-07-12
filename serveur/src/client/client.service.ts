import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async signUp(createDto: CreateClientDto): Promise<Client> {
    const existing = await this.clientRepository.findOne({ where: { email: createDto.email } });
    if (existing) throw new Error('Email déjà utilisé');

    const hashedPassword = await bcrypt.hash(createDto.password, 10);
    const client = this.clientRepository.create({
      ...createDto,
      password: hashedPassword,
      role: 'client',
    });

    return this.clientRepository.save(client);
  }

  async signIn(email: string, password: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { email } });
    if (!client) throw new UnauthorizedException('Email ou mot de passe invalide');

    const valid = await bcrypt.compare(password, client.password);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe invalide');

    return client;
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException(`Client #${id} non trouvé`);
    return client;
  }

  async update(id: string, updateDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    Object.assign(client, updateDto);
    return this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }
}
