import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UserPreference } from './user-preference.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { ExternalCurrencyService } from 'src/shared/external-currency.service';
import { Currency } from 'src/currencies/currency.entity';
import { CourierCompany } from 'src/courier_companies/courier_company.entity';
import { DEFAULT_CURRENCY } from '../shared/constants';

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: Repository<UserPreference>,
    private externalCurrencyService: ExternalCurrencyService,
  ) {}

  async create(createUserPreferenceDto: CreateUserPreferenceDto) {
    const existingPreference = await this.userPreferenceRepository.findOne({
      where: { user: { id: createUserPreferenceDto.user_id } },
    });

    if (existingPreference) {
      if (createUserPreferenceDto.currency_id) {
        existingPreference.currency = {
          id: createUserPreferenceDto.currency_id,
        } as Currency;
      }
      if (createUserPreferenceDto.courier_id) {
        existingPreference.courier = {
          id: createUserPreferenceDto.courier_id,
        } as CourierCompany;
      }
      return await this.userPreferenceRepository.save(existingPreference);
    }

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

  async getConvertedPriceByCountry(
    countryName: string,
    price: number,
  ): Promise<number> {
    if (!countryName || !price) return price;

    try {
      const currencyInfo =
        await this.externalCurrencyService.getCurrencyInfo(countryName);
      const { code, rate } = currencyInfo;

      if (code === DEFAULT_CURRENCY.code) {
        return price;
      }

      return Number(price) * Number(rate);
    } catch (error) {
      console.error(
        `Error converting price by country (${countryName}):`,
        error,
      );
      return price;
    }
  }

  async getFormattedConvertedPriceByCountry(
    countryName: string,
    price: number,
  ) {
    if (!countryName || !price) {
      return { price: Number(price), currency: DEFAULT_CURRENCY.symbol };
    }

    try {
      const currencyInfo =
        await this.externalCurrencyService.getCurrencyInfo(countryName);
      const { code, symbol, rate } = currencyInfo;

      const convertedPrice =
        code === DEFAULT_CURRENCY.code ? Number(price) : Number(price) * rate;
      return {
        price: convertedPrice,
        currency:
          code === DEFAULT_CURRENCY.code ? DEFAULT_CURRENCY.symbol : symbol,
      };
    } catch (error) {
      console.error(
        `Error formatting converted price by country (${countryName}):`,
        error,
      );
      return { price: Number(price), currency: DEFAULT_CURRENCY.symbol };
    }
  }

  async getUserPreferredCurrency(userId: string): Promise<CurrencyInfo | null> {
    const pref = await this.userPreferenceRepository.findOne({
      where: { user: { id: userId } },
      relations: { currency: true },
    });
    if (!pref || !pref.currency) return null;
    const latestInfo = await this.externalCurrencyService.getCurrencyInfoByCode(
      pref.currency.currency_code,
    );
    return {
      code: pref.currency.currency_code,
      symbol: pref.currency.currency_symbol,
      rate: latestInfo.rate,
    };
  }

  async getCurrencyRateInfo(selectedCountry: string): Promise<CurrencyInfo> {
    return this.externalCurrencyService.getCurrencyInfo(selectedCountry);
  }

  async getCurrencyInfoByCode(currencyCode: string): Promise<CurrencyInfo> {
    return this.externalCurrencyService.getCurrencyInfoByCode(currencyCode);
  }

  async getFormattedConvertedPriceByCurrency(
    currencyCode: string,
    price: number,
  ) {
    const currencyInfo = await this.getCurrencyInfoByCode(currencyCode);
    const { code, symbol, rate } = currencyInfo;
    if (!code || !symbol || !rate) {
      throw new BadRequestException(
        'Currency code, symbol, or rate is missing',
      );
    }
    const convertedPrice =
      code === DEFAULT_CURRENCY.code ? Number(price) : Number(price) * rate;

    if (typeof convertedPrice !== 'number') {
      throw new BadRequestException('Failed to get converted price');
    }
    return {
      price: convertedPrice.toFixed(2),
      currency:
        code === DEFAULT_CURRENCY.code ? DEFAULT_CURRENCY.symbol : symbol,
    };
  }

  async update(id: string, updateUserPreferenceDto: UpdateUserPreferenceDto) {
    const existingPreference = await this.userPreferenceRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!existingPreference) {
      throw new NotFoundException(`UserPreference with id ${id} not found`);
    }

    if (
      updateUserPreferenceDto.user_id !== undefined &&
      existingPreference.user.id !== updateUserPreferenceDto.user_id
    ) {
      throw new BadRequestException('User ID mismatch');
    }

    if (updateUserPreferenceDto.currency_id) {
      existingPreference.currency = {
        id: updateUserPreferenceDto.currency_id,
      } as Currency;
    }
    if (updateUserPreferenceDto.courier_id) {
      existingPreference.courier = {
        id: updateUserPreferenceDto.courier_id,
      } as CourierCompany;
    }

    return this.userPreferenceRepository.save(existingPreference);
  }

  async updateByUserId(
    userId: string,
    updateUserPreferenceDto: UpdateUserPreferenceDto,
  ) {
    const existingPreference = await this.findByUser(userId);

    if (!existingPreference) {
      throw new NotFoundException(
        `UserPreference for user ID ${userId} not found`,
      );
    }

    if (updateUserPreferenceDto.currency_id) {
      existingPreference.currency = {
        id: updateUserPreferenceDto.currency_id,
      } as Currency;
    }
    if (updateUserPreferenceDto.courier_id) {
      existingPreference.courier = {
        id: updateUserPreferenceDto.courier_id,
      } as CourierCompany;
    }

    return this.userPreferenceRepository.save(existingPreference);
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
