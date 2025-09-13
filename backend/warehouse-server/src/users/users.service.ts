import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';

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
      name: user.name,
      created_at: user.created_at,
      role: user.role,
      suite_no: user.suite_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      alternate_phone_number: user.alternate_phone_number,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
      updated_at: user.updated_at,
    }));
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findCountryByName(name: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { name } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const user = this.userRepository.create({
      ...createUserDto,
    });
    return this.userRepository.save(user);
  }

  async update(
    id: string,
    updateUserDto: { last_logout?: number },
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, {
      ...updateUserDto,
    });
    return this.userRepository.save(user);
  }
}
