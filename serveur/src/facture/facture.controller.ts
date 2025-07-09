import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { FactureService } from './facture.service';

@Controller('factures')
export class FactureController {
  constructor(private readonly factureService: FactureService) {}

  @Post()
  create(@Body() data) {
    return this.factureService.create(data);
  }

  @Get()
  findAll(@Query('etat') etat?: string) {
    if (etat === 'payee' || etat === 'impayee') {
      return this.factureService.findAll(etat);
    }
    return this.factureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.factureService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data) {
    return this.factureService.update(+id, data);
  }

  @Put(':id/payer')
  marquerCommePayee(@Param('id') id: number) {
    return this.factureService.marquerCommePayee(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.factureService.remove(+id);
  }
}