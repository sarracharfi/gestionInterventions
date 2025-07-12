import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MaterielService } from './materiel.service';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { Express } from 'express';

@Controller('materiels')
export class MaterielController {
  constructor(private readonly materielService: MaterielService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/materiels',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateMaterielDto,
  ) {
    dto.imagePath = file?.filename;
    return this.materielService.create(dto);
  }

  @Get()
  findAll() {
    return this.materielService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materielService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateMaterielDto>) {
    return this.materielService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materielService.remove(id);
  }
}
