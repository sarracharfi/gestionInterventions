import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { User } from './user.entity'; // ✅ correction ici

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    if (!updatedUser) {
      throw new NotFoundException(`Impossible de mettre à jour : l'utilisateur avec l'ID ${id} n'existe pas`);
    }
    return updatedUser;
  }

  async deleteById(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
