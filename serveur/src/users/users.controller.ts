import {
  Body, Controller, Delete, Get, Param, Post, Put
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';  // <-- correction ici

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUserById(Number(id));
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>
  ): Promise<User> {
    return await this.usersService.updateUser(Number(id), updateUserDto);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.deleteById(Number(id));
    return { message: 'Utilisateur supprimé avec succès' };
  }
}
