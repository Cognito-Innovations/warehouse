import { Injectable } from '@nestjs/common';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UserPreference } from './user-preference.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: Repository<UserPreference>,
  ) {}

  async create(createUserPreferenceDto: CreateUserPreferenceDto) {
    const userPreference = this.userPreferenceRepository.create({
      currency: { id: createUserPreferenceDto.currency_id },
      courier: { id: createUserPreferenceDto.courier_id },
      user: { id: createUserPreferenceDto.user_id },
    });
    return await this.userPreferenceRepository.save(userPreference);
  }

  async findAll() {
    return await this.userPreferenceRepository.find();
  }

  async findOne(id: string) {
    return await this.userPreferenceRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserPreferenceDto: UpdateUserPreferenceDto) {
    const existing = await this.userPreferenceRepository.findOne({
      where: { id },
    });
    if (existing) {
      return this.userPreferenceRepository.update(id, {
        currency: { id: updateUserPreferenceDto.currency_id },
        courier: { id: updateUserPreferenceDto.courier_id },
        user: { id: updateUserPreferenceDto.user_id },
      });
    } else {
      return this.create({
        currency_id: updateUserPreferenceDto.currency_id || '',
        courier_id: updateUserPreferenceDto.courier_id || '',
        user_id: updateUserPreferenceDto.user_id || '',
      });
    }
  }
  async delete(id: string) {
    return await this.userPreferenceRepository.delete(id);
  }
}
