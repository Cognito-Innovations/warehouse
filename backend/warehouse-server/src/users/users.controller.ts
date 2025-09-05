import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from '../auth/dto/auth-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.usersService.getAllUsers();
  }
}
