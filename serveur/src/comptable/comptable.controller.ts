import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ComptableService } from './comptable.service';
import { Comptable } from './comptable.entity';

@Controller('comptables')
export class ComptableController {
  constructor(private readonly comptableService: ComptableService) {}

  @Post()
  create(@Body() data: Partial<Comptable>) {
    return this.comptableService.create(data);
  }

  @Get()
  findAll() {
    return this.comptableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.comptableService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Comptable>) {
    return this.comptableService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.comptableService.remove(+id);
  }
}
