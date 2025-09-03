import { Body, Controller, Get, Post } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: { email: string; name?: string; image?: string }) {
    return this.usersService.createUser(body);
  }

  @Get()
  async findAll() {
    return this.usersService.getAllUsers();
  }
}