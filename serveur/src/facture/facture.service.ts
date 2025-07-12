import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facture } from './entities/facture.entity';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';

@Injectable()
export class FactureService {
  constructor(
    @InjectRepository(Facture)
    private readonly factureRepo: Repository<Facture>,
  ) {}

  async create(data: CreateFactureDto): Promise<Facture> {
    const montantHT = data.quantite * data.prixUnitaire;
    const montantTVA = montantHT * (data.tva / 100);
    const montantTTC = montantHT + montantTVA;

    const codeSuivi = 'FCT-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const factureData = {
      ...data,
      montantHT,
      montantTVA,
      montantTTC,
      estPayee: data.estPayee || false,
      dateEmission: data.dateEmission || new Date(),
      codeSuivi, // <<< ajout ici
    };

    return await this.factureRepo.save(factureData);
  }

  async findAll(etat?: 'payee' | 'impayee'): Promise<Facture[]> {
    if (etat) {
      return await this.factureRepo.find({
        where: { estPayee: etat === 'payee' }
      });
    }
    return await this.factureRepo.find();
  }

  async findOne(id: number): Promise<Facture | null> {
    return await this.factureRepo.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateFactureDto): Promise<Facture | null> {
    const facture = await this.findOne(id);
    if (!facture) return null;

    const updatedData = { ...data };

    if (
      data.quantite !== undefined ||
      data.prixUnitaire !== undefined ||
      data.tva !== undefined
    ) {
      const quantite = data.quantite ?? facture.quantite;
      const prixUnitaire = data.prixUnitaire ?? facture.prixUnitaire;
      const tva = data.tva ?? facture.tva;

      updatedData.montantHT = quantite * prixUnitaire;
      updatedData.montantTVA = updatedData.montantHT * (tva / 100);
      updatedData.montantTTC = updatedData.montantHT + updatedData.montantTVA;
    }

    await this.factureRepo.update(id, updatedData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.factureRepo.delete(id);
  }

  async marquerCommePayee(id: number): Promise<Facture | null> {
    await this.factureRepo.update(id, { estPayee: true });
    return this.findOne(id);
  }
}
