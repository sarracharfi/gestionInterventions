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
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('signup')
  async signUp(@Body() createDto: CreateClientDto) {
    try {
      const client = await this.clientService.signUp(createDto);
      const { password, ...result } = client;
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signin')
  async signIn(@Body() loginDto: { email: string; password: string }) {
    try {
      const client = await this.clientService.signIn(loginDto.email, loginDto.password);
      const { password, ...result } = client;
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get()
  async findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const client = await this.clientService.findOne(id);
    if (!client) throw new NotFoundException('Client non trouvé');
    const { password, ...result } = client;
    return result;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateClientDto) {
    try {
      const client = await this.clientService.update(id, updateDto);
      const { password, ...result } = client;
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.clientService.remove(id);
      return { message: 'Client supprimé avec succès' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
