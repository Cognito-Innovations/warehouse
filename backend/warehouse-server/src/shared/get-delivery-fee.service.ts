import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CacheManagerService } from './cache-manager.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { COUNTRY_CODE_ALPHA3_TO_ALPHA2_MAP } from './constants';
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

  //TODO P0: refactor this function to make it more readable and maintainable
  async getDeliveryOptions(
    weight: number,
    country_code: string,
    currency_code: string,
  ): Promise<DeliveryOption[]> {
    //TODO P0: in frontend or backend sometimes we are passing country code null, make sure some default fallbackcode
    let standardized_country_code = country_code?.toUpperCase() || '';
    if (
      standardized_country_code.length === 3 &&
      COUNTRY_CODE_ALPHA3_TO_ALPHA2_MAP[standardized_country_code]
    ) {
      standardized_country_code =
        COUNTRY_CODE_ALPHA3_TO_ALPHA2_MAP[standardized_country_code];
    }

    const username = process.env.UGFLASH_USERNAME;
    const password = process.env.UGFLASH_PASSWORD;

    if (!username || !password) {
      throw new BadRequestException('Shipment credentials not configured');
    }

    const cacheKey = `delivery_rates:${standardized_country_code}:${weight}`;

    const convertAmount = async (amount: number): Promise<number> => {
      if (!currency_code) {
        return amount;
      }
      return this.externalCurrencyService.convertFromINR(amount, currency_code);
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<DeliveryRatesResponse>(
          'https://ugflash.com/api/shipment/rates/list',
          {
            username,
            password,
            country_code: standardized_country_code,
            weight,
          },
        ),
      );

      if (response.data.success && response.data.data.length > 0) {
        const options = response.data.data.map((item) => ({
          delivery_platform: item.delivery_platform || 'Standard Delivery',
          total_amount: item.total_amount || 0,
          estimated_time: item.estimated_time,
        }));
        await this.cacheService.create(cacheKey, options, 60 * 60 * 48);

        const convertedOptions = await Promise.all(
          options.map(async (option) => ({
            ...option,
            total_amount: await convertAmount(option.total_amount),
          })),
        );

        return convertedOptions;
      }

      throw new BadRequestException('No delivery options available');
    } catch (error) {
      this.logger.error('Failed to fetch delivery options', error);

      const cachedRates =
        await this.cacheService.get<DeliveryOption[]>(cacheKey);
      if (cachedRates && cachedRates.length > 0) {
        const convertedCached = await Promise.all(
          cachedRates.map(async (option) => ({
            ...option,
            total_amount: await convertAmount(option.total_amount),
          })),
        );
        return convertedCached;
      }

      // Calculate average from similar entries in DB
      const likeKey = `delivery_rates:${standardized_country_code}:%`;
      const entries = await this.deliveryCacheRepo.find({
        where: { key: ILike(likeKey) },
        relations: ['options'],
      });

      let sum = 0;
      let count = 0;
      const now = Date.now();
      for (const entry of entries) {
        if (!entry.expiry || now < entry.expiry) {
          if (entry.options && entry.options.length > 0) {
            sum += entry.options[0].total_amount;
            count++;
          }
        }
      }

      const avg = count > 0 ? sum / count : 2;
      const convertedAvg = await convertAmount(avg);

      return [
        {
          delivery_platform: 'Standard Delivery',
          total_amount: convertedAvg,
          estimated_time: '10-15 days',
        },
      ];
    }
  }
}
