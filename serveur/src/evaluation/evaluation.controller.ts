import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async create(@Body() dto: CreateEvaluationDto) {
    return this.evaluationService.create(dto);
  }

  @Get()
  async findAll() {
    return this.evaluationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.evaluationService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateEvaluationDto) {
    return this.evaluationService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.evaluationService.delete(id);
  }
}
