import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { TechnicienService } from './technicien.service';
import { CreateTechnicienDto } from './dto/create-technicien.dto';
import { UpdateTechnicienDto } from './dto/update-technicien.dto';
 
@Controller('technicien')
export class TechnicienController {
  constructor(private readonly technicienService: TechnicienService) {}

  @Post('signup')
  async signUp(@Body() createDto: CreateTechnicienDto) {
    try {
      const technicien = await this.technicienService.signUp(createDto);
      const { password, ...result } = technicien;
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signin')
  async signIn(@Body() loginDto: { email: string; password: string }) {
    try {
      const technicien = await this.technicienService.signIn(
        loginDto.email,
        loginDto.password,
      );
      const { password, ...result } = technicien;
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  // Récupérer tous les techniciens
  @Get()
  async findAll() {
    return this.technicienService.findAll();
  }

  // Récupérer un technicien par son id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const technicien = await this.technicienService.findOne(id);
    if (!technicien) {
      throw new NotFoundException('Technicien non trouvé');
    }
    const { password, ...result } = technicien;
    return result;
  }

  // Mettre à jour un technicien
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateTechnicienDto) {
    try {
      const technicien = await this.technicienService.update(id, updateDto);
      const { password, ...result } = technicien;
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Supprimer un technicien
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.technicienService.remove(id);
      return { message: 'Technicien supprimé avec succès' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
