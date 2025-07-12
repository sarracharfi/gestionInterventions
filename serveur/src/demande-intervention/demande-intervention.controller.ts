import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DemandeInterventionService } from './demande-intervention.service';
 
import { InterventionStatus } from './demande.entity';
import { CreateDemandeInterventionDto } from './create-intervention';
import { UpdateDemandeInterventionDto } from './dto/update-intervention';

@Controller('demandes-intervention')
export class DemandeInterventionController {
  constructor(private readonly demandeService: DemandeInterventionService) {}

  @Post()
  create(@Body() createDto: CreateDemandeInterventionDto) {
    return this.demandeService.create(createDto);
  }

  @Get()
  findAll() {
    return this.demandeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDemandeInterventionDto) {
    return this.demandeService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demandeService.remove(id);
  }

  @Put(':id/status/:status')
  changeStatus(
    @Param('id') id: string,
    @Param('status') status: InterventionStatus,
  ) {
    return this.demandeService.changeStatus(id, status);
  }
}
