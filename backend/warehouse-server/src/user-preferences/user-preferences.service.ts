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

  async findByUserCurrencyRate(userId: string) {
    const userPreference = await this.userPreferenceRepository.findOne({
      where: { user: { id: userId } },
      relations: ['currency'],
    });
    return {
      rate: userPreference?.currency.rate,
      currency_symbol: userPreference?.currency.currency_symbol,
    };
  }

  async getUserCurrency(userId: string) {
    const userPreference = await this.userPreferenceRepository.findOne({
      where: { user: { id: userId } },
      relations: ['currency'],
    });
    return userPreference?.currency.currency_symbol;
  }

  async getFormattedConvertedPrice(userId: string, price: number) {
    const userPreference = await this.userPreferenceRepository.findOne({
      where: { user: { id: userId } },
      relations: ['currency'],
    });
    const rate = userPreference?.currency.rate;
    const currency_symbol = userPreference?.currency.currency_symbol;
    if (rate && currency_symbol && price) {
      const currency_symbol = userPreference?.currency.currency_symbol;
      const convertedPrice = price * (rate || 0);
      const formattedPrice = convertedPrice.toFixed(2);
      return `${formattedPrice} ${currency_symbol}`;
    }
    return String(price);
  }

  async getConvertedPrice(userId: string, price: number) {
    const userPreference = await this.userPreferenceRepository.findOne({
      where: { user: { id: userId } },
      relations: ['currency'],
    });
    const rate = userPreference?.currency.rate;
    if (rate && price) {
      const convertedPrice = price * (rate || 0);
      return convertedPrice;
    }
    return price;
  }

  async update(id: string, updateUserPreferenceDto: UpdateUserPreferenceDto) {
    const userPreference = this.userPreferenceRepository.create({
      id,
      user: { id: updateUserPreferenceDto.user_id },
      courier: { id: updateUserPreferenceDto.courier_id },
      currency: { id: updateUserPreferenceDto.currency_id },
    });

    return this.userPreferenceRepository.save(userPreference);
  }

  async delete(id: string) {
    return await this.userPreferenceRepository.delete(id);
  }

  async findByUser(userId: string): Promise<UserPreference | null> {
    return this.userPreferenceRepository.findOne({
      where: { user: { id: userId } },
      relations: ['currency', 'courier', 'user'],
      order: { updated_at: 'DESC' },
    });
  }
}
