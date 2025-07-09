import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from '../users/user.entity';

// Définition locale de l'enum Role
enum Role {
  ADMIN = 'admin',
  TECHNICIEN = 'technicien',
  CLIENT = 'client',
  COMPTABLE = 'comptable',
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const {
      nom,
      prenom,
      email,
      password,
      telephone,
      entreprise,
      specialite,
      codeComptable,
      matricule,
      role,
    } = signUpDto;

    if (!Object.values(Role).includes(role)) {
      throw new BadRequestException('Rôle invalide');
    }

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      telephone,
      role,
      entreprise: role === Role.CLIENT ? entreprise : undefined,
      specialite: role === Role.TECHNICIEN ? specialite : undefined,
      codeComptable: role === Role.COMPTABLE ? codeComptable : undefined,
      matricule: [Role.TECHNICIEN, Role.COMPTABLE].includes(role) ? matricule : undefined,
    });

    await this.usersRepository.save(user);

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; role: string }> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { token, role: user.role };
  }
}
