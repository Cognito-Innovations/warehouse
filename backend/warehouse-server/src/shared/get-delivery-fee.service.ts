import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

export interface DeliveryOption {
  service_name: string;
  total_amount: number;
  estimated_days?: string;
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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      return value ?? null;
    } catch (error) {
      this.logger.warn(`Redis cache read failed for ${key}`, error);
      return null;
    }
  }

  private async setInCache<T>(
    key: string,
    value: T,
    ttlSeconds = 60 * 60 * 48, // 2 days
  ): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttlSeconds);
    } catch (error) {
      this.logger.warn(`Redis cache write failed for ${key}`, error);
    }
  }

  getWeightInKg(unit_value: number, label: string): number {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel === 'kg') return unit_value;
    if (lowerLabel === 'g') return unit_value / 1000;
    if (lowerLabel === 'mg') return unit_value / 1000000;
    if (lowerLabel === 'lb' || lowerLabel === 'pound')
      return unit_value * 0.453592;
    if (lowerLabel === 'oz' || lowerLabel === 'ounce')
      return unit_value * 0.0283495;
    if (lowerLabel === 'ltr' || lowerLabel === 'liter') return unit_value;
    if (lowerLabel === 'ml') return unit_value / 1000;
    return unit_value;
  }

  async getDeliveryFee(weight: number, country_code: string): Promise<number> {
    const options = await this.getDeliveryOptions(weight, country_code);
    if (options.length > 0) {
      return options[0].total_amount;
    }
    return 2; // Fallback default
  }

  async getDeliveryOptions(
    weight: number,
    country_code: string,
  ): Promise<DeliveryOption[]> {
    const username = process.env.UGFLASH_USERNAME || 'UGAA01';
    const password = process.env.UGFLASH_PASSWORD || 'Ugflash@2022';

    if (!username || !password) {
      throw new BadRequestException('Shipment credentials not configured');
    }

    const cacheKey = `delivery_rates:${country_code}:${weight}`;

    const cachedRates = await this.getFromCache<DeliveryOption[]>(cacheKey);
    if (cachedRates && cachedRates.length > 0) {
      return cachedRates;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post<DeliveryRatesResponse>(
          'https://ugflash.com/api/shipment/rates/list',
          {
            username,
            password,
            country_code,
            weight,
          },
        ),
      );

      if (response.data.success && response.data.data.length > 0) {
        const options = response.data.data.map((item) => ({
          service_name: item.service_name || 'Standard Delivery',
          total_amount: item.total_amount || 0,
          estimated_days: item.estimated_days,
          description: item.description,
        }));

        await this.setInCache(cacheKey, options);

        return options;
      }

      throw new BadRequestException('No delivery options available');
    } catch (error) {
      this.logger.error('Failed to fetch delivery options', error);
      // Return fallback options if API fails
      return [
        {
          service_name: 'Standard Delivery',
          total_amount: 2,
          estimated_days: '10-15 days',
          description: 'Standard shipping',
        },
      ];
    }
  }
}
