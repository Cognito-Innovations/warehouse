import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

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
      name: user?.name,
      image: user?.image,
      suite_no: user.suite_no,
      identifier: user?.identifier,
      phone_number: user?.phone_number,
      phone_number_2: user?.phone_number_2,
      gender: user?.gender,
      dob: user?.dob,
      verified: user.verified,
      country: user.country, // This is now a string field, not a relation
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { 
        email: email
      }
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (
      'email' in updateUserDto &&
      updateUserDto.email &&
      updateUserDto.email !== user.email
    ) {
      const existingUser = await this.findByEmail(
        updateUserDto.email as string,
      );
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.softDelete(id);
  }

  async restore(id: string): Promise<User> {
    const result = await this.userRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found or not deleted`);
    }
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
