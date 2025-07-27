export class CreateAdminDto {
  email: string;
  password: string;
  nom: string;
  niveauAcces?: string; // optionnel, peut avoir une valeur par défaut
}
