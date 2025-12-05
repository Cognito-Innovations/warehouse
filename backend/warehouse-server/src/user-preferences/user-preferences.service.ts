import { Injectable } from '@nestjs/common';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UserPreference } from './user-preference.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { ExternalCurrencyService } from 'src/shared/external-currency.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

@Injectable()
export class UserPreferencesService {
  private readonly EXCHANGE_RATE_URL = 'https://api.frankfurter.app/latest';
  private static SYMBOL_MAP: Record<string, string> = {
    USD: '$',
    INR: '₹',
  };

  constructor(
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: Repository<UserPreference>,
    private externalCurrencyService: ExternalCurrencyService,
    private httpService: HttpService,
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

  async getConvertedPriceByCountry(
    countryName: string,
    price: number,
  ): Promise<number> {
    if (!countryName || !price) return price;

    try {
      const currencyInfo =
        await this.externalCurrencyService.getCurrencyInfo(countryName);
      const { code, rate } = currencyInfo;

      if (code === 'USD') {
        return price;
      }

      return Number(price) * Number(rate);
    } catch (error) {
      return price;
    }
  }

  async getFormattedConvertedPriceByCountry(
    countryName: string,
    price: number,
  ) {
    if (!countryName || !price) {
      return { price: Number(price), currency: '$' };
    }

    try {
      const currencyInfo =
        await this.externalCurrencyService.getCurrencyInfo(countryName);
      const { code, symbol, rate } = currencyInfo;

      const convertedPrice =
        code === 'USD' ? Number(price) : Number(price) * rate;
      return { price: convertedPrice, currency: code === 'USD' ? '$' : symbol };
    } catch (error) {
      return { price: Number(price), currency: '$' };
    }
  }

  async getUserPreferredCurrency(userId: string): Promise<CurrencyInfo | null> {
    const pref = await this.userPreferenceRepository.findOne({
      where: { user: { id: userId } },
      relations: { currency: true },
    });
    if (!pref || !pref.currency) return null;
    return {
      code: pref.currency.currency_code,
      symbol: pref.currency.currency_symbol,
      rate: pref.currency.rate,
    };
  }

  async getCurrencyRateInfo(selectedCountry: string): Promise<CurrencyInfo> {
    return this.externalCurrencyService.getCurrencyInfo(selectedCountry);
  }

  async getCurrencyInfoByCode(currencyCode: string): Promise<CurrencyInfo> {
    const code = currencyCode.toUpperCase();
    const symbol = UserPreferencesService.SYMBOL_MAP[code] || '$';
    let rate = 1;

    try {
      const rateResponse = await firstValueFrom(
        this.httpService.get(`${this.EXCHANGE_RATE_URL}?from=USD&to=${code}`),
      );
      const rateData = rateResponse.data;

      if (!rateData.rates || typeof rateData.rates[code] !== 'number') {
        throw new Error(`No exchange rate found for ${code}`);
      }
      rate = rateData.rates[code];
    } catch (error) {
      console.error(`Failed to fetch rate for ${code}:`, error);
      rate = 1;
    }

    return { code, symbol, rate };
  }

  async getFormattedConvertedPriceByCurrency(
    currencyCode: string,
    price: number,
  ) {
    const currencyInfo = await this.getCurrencyInfoByCode(currencyCode);
    const { code, symbol, rate } = currencyInfo;

    const convertedPrice =
      code === 'USD' ? Number(price) : Number(price) * rate;
    return { price: convertedPrice, currency: code === 'USD' ? '$' : symbol };
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
