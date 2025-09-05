import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from '../auth/dto/auth-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.find({
      order: { email: 'ASC' },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      is_logged_in: user.is_logged_in,
      last_login: user.last_login,
      last_logout: user.last_logout,
      created_at: user.created_at,
      country: user.country,
    }));
  }
}