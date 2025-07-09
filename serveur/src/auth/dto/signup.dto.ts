import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/users/dto/user.dto';

export class SignUpDto {
  @IsNotEmpty()
  nom: string;

  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role;

  telephone?: string;
  entreprise?: string;
  specialite?: string;
  codeComptable?: string;
  matricule?: string;
}
