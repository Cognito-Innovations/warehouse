import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CacheManagerService } from './cache-manager.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import {
  CACHE_KEY,
  COUNTRY_CODE_ALPHA3_TO_ALPHA2_MAP,
  DEFAULT_COUNTRY_CODE,
} from './constants';
import { DeliveryCache } from './entities/cache/delivery-cache.entity';
import { ExternalCurrencyService } from './external-currency.service';

export interface DeliveryOption {
  delivery_platform: string;
  total_amount: number;
  estimated_time?: string;
  description?: string;
}

export interface DeliveryRatesResponse {
  success: boolean;
  data: DeliveryOption[];
}

@Injectable()
export class DeliveryFeeService {
  private readonly logger = new Logger(DeliveryFeeService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: CacheManagerService,
    @InjectRepository(DeliveryCache)
    private readonly deliveryCacheRepo: Repository<DeliveryCache>,
    private readonly externalCurrencyService: ExternalCurrencyService,
  ) {}

  getWeightInKg(unit_value: number, label: string): number {
    const lowerLabel = label.toLowerCase();

    switch (lowerLabel) {
      case 'kg':
        return unit_value;

      case 'g':
        return unit_value / 1000;

      case 'mg':
        return unit_value / 1_000_000;

      case 'lb':
      case 'pound':
        return unit_value * 0.453592;

      case 'oz':
      case 'ounce':
        return unit_value * 0.0283495;

      case 'ltr':
      case 'liter':
        return unit_value * 1;

      case 'ml':
        return unit_value / 1000;

      default:
        return unit_value;
    }
  }

  async getDeliveryFee(
    weight: number,
    country_code: string,
    currency: string,
  ): Promise<number> {
    const options = await this.getDeliveryOptions(
      weight,
      country_code,
      currency,
    );
    if (options.length > 0) {
      return options[0].total_amount;
    }
    return 2; // Fallback default
  }

  async getDeliveryOptions(
    weight: number,
    countryCode?: string,
    currencyCode?: string,
  ): Promise<DeliveryOption[]> {
    const normalizedCountry = this.normalizeCountryCode(countryCode);
    const cacheKey = this.buildCacheKey(normalizedCountry, weight);

    const convertAmount = (amount: number) =>
      this.convertCurrency(amount, currencyCode);

    try {
      const options = await this.fetchFromExternalApi(
        normalizedCountry,
        weight,
      );

      await this.cacheService.create(cacheKey, options, 60 * 60 * 48);

      return Promise.all(
        options.map(async (opt) => ({
          ...opt,
          total_amount: await convertAmount(opt.total_amount),
        })),
      );
    } catch (error) {
      this.logger.error('Failed to fetch delivery options', error);
      return this.getFallbackOptions(
        cacheKey,
        normalizedCountry,
        convertAmount,
      );
    }
  }

  private normalizeCountryCode(countryCode?: string): string {
    let code = countryCode?.toUpperCase() || DEFAULT_COUNTRY_CODE;

    if (code.length === 3 && COUNTRY_CODE_ALPHA3_TO_ALPHA2_MAP[code]) {
      code = COUNTRY_CODE_ALPHA3_TO_ALPHA2_MAP[code];
    }

    return code;
  }

  private buildCacheKey(countryCode: string, weight: number): string {
    return `${CACHE_KEY.DELIVERY}:${countryCode}:${weight}`;
  }

  private async convertCurrency(
    amount: number,
    currencyCode?: string,
  ): Promise<number> {
    if (!currencyCode) return amount;
    return this.externalCurrencyService.convertFromINR(amount, currencyCode);
  }

  private async fetchFromExternalApi(
    countryCode: string,
    weight: number,
  ): Promise<DeliveryOption[]> {
    const username = process.env.UGFLASH_USERNAME;
    const password = process.env.UGFLASH_PASSWORD;

    if (!username || !password) {
      throw new BadRequestException('Shipment credentials not configured');
    }

    const response = await firstValueFrom(
      this.httpService.post<DeliveryRatesResponse>(
        'https://ugflash.com/api/shipment/rates/list',
        {
          username,
          password,
          country_code: countryCode,
          weight,
        },
      ),
    );

    if (!response.data.success || response.data.data.length === 0) {
      throw new BadRequestException('No delivery options available');
    }

    return response.data.data.map((item) => ({
      delivery_platform: item.delivery_platform || 'Standard Delivery',
      total_amount: item.total_amount || 0,
      estimated_time: item.estimated_time,
    }));
  }

  private async getFallbackOptions(
    cacheKey: string,
    countryCode: string,
    convertAmount: (n: number) => Promise<number>,
  ): Promise<DeliveryOption[]> {
    const cached = await this.cacheService.get<DeliveryOption[]>(cacheKey);

    if (cached?.length) {
      return Promise.all(
        cached.map(async (opt) => ({
          ...opt,
          total_amount: await convertAmount(opt.total_amount),
        })),
      );
    }

    const avg = await this.calculateAverageFromDb(countryCode);
    const convertedAvg = await convertAmount(avg);

    return [
      {
        delivery_platform: 'Standard Delivery',
        total_amount: convertedAvg,
        estimated_time: '10-15 days',
      },
    ];
  }

  private async calculateAverageFromDb(countryCode: string): Promise<number> {
    const likeKey = `${CACHE_KEY.DELIVERY}:${countryCode}:%`;
    const entries = await this.deliveryCacheRepo.find({
      where: { key: ILike(likeKey) },
      relations: ['options'],
    });

    let sum = 0;
    let count = 0;
    const now = Date.now();
    for (const entry of entries) {
      if (!entry.expiry || now < entry.expiry) {
        if (entry.options?.length) {
          sum += entry.options[0].total_amount;
          count++;
        }
      }
    }

    return count > 0 ? sum / count : 2;
  }
}
