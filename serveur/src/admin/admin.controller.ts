// src/admin/admin.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() body: { email: string; password: string; role?: string }) {
    return this.adminService.createAdmin(body.email, body.password, body.role);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.adminService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.delete(+id);
  }
}
