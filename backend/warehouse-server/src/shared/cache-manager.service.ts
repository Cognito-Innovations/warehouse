import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyCache } from './entities/cache/currency-cache.entity';
import { DeliveryCache } from './entities/cache/delivery-cache.entity';
import { DeliveryOptionCache } from './entities/cache/delivery-option-cache.entity';

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
  timestamp: number;
}

interface DeliveryOption {
  delivery_platform: string;
  total_amount: number;
  estimated_time?: string;
  description?: string;
}

@Injectable()
export class CacheManagerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(CurrencyCache)
    private currencyCacheRepo: Repository<CurrencyCache>,
    @InjectRepository(DeliveryCache)
    private deliveryCacheRepo: Repository<DeliveryCache>,
    @InjectRepository(DeliveryOptionCache)
    private deliveryOptionRepo: Repository<DeliveryOptionCache>,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const cached = await this.cacheManager.get<T>(key);
      if (cached !== undefined) {
        return cached;
      }
    } catch (error) {
      console.warn(`Cache get failed for ${key}, falling back to DB`, error);
    }

    return this.getFromDb<T>(key);
  }

  private async getFromDb<T>(key: string): Promise<T | undefined> {
    const now = Date.now();
    let dbValue: any;
    let expiry: number | undefined;

    if (this.isCurrencyKey(key)) {
      const entry = await this.currencyCacheRepo.findOne({ where: { key } });
      if (entry && (!entry.expiry || now < entry.expiry)) {
        dbValue = {
          code: entry.code,
          symbol: entry.symbol,
          rate: entry.rate,
          timestamp: entry.timestamp,
        };
        expiry = entry.expiry;
      }
    } else if (this.isDeliveryKey(key)) {
      const entry = await this.deliveryCacheRepo.findOne({
        where: { key },
        relations: ['options'],
      });
      if (entry && (!entry.expiry || now < entry.expiry)) {
        dbValue = entry.options.map((option) => ({
          delivery_platform: option.delivery_platform,
          total_amount: option.total_amount,
          estimated_time: option.estimated_time,
          description: option.description,
        }));
        expiry = entry.expiry;
      }
    } else {
      console.warn(`Unsupported cache key: ${key}`);
      return undefined;
    }

    if (!dbValue) return undefined;

    if (expiry && expiry > now) {
      const remainingSeconds = Math.floor((expiry - now) / 1000);
      try {
        await this.cacheManager.set(key, dbValue, remainingSeconds);
      } catch (error) {
        console.warn(`Cache set failed for ${key}:`, error);
      }
    }

    return dbValue as T;
  }

  async create<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const now = Date.now();
    const expiry = now + ttlSeconds * 1000;

    try {
      await this.cacheManager.set(key, value, ttlSeconds);
    } catch (error) {
      console.warn(`Cache set failed for ${key}:`, error);
    }

    if (this.isCurrencyKey(key)) {
      await this.saveCurrencyCache(key, value as CurrencyInfo, expiry);
    } else if (this.isDeliveryKey(key)) {
      await this.saveDeliveryCache(key, value as DeliveryOption[], expiry);
    } else {
      console.warn(`Unsupported cache key for create: ${key}`);
    }
  }

  private isCurrencyKey(key: string): boolean {
    return key.startsWith('currency:') || key.startsWith('currency_code:');
  }

  private isDeliveryKey(key: string): boolean {
    return key.startsWith('delivery_rates:');
  }

  private async saveCurrencyCache(
    key: string,
    value: CurrencyInfo,
    expiry: number,
  ): Promise<void> {
    let entity = await this.currencyCacheRepo.findOne({ where: { key } });
    if (!entity) {
      entity = new CurrencyCache();
    }

    entity.key = key;
    entity.code = value.code;
    entity.symbol = value.symbol;
    entity.rate = value.rate;
    entity.timestamp = value.timestamp;
    entity.expiry = expiry;

    await this.currencyCacheRepo.save(entity);
  }

  private async saveDeliveryCache(
    key: string,
    options: DeliveryOption[],
    expiry: number,
  ): Promise<void> {
    let entity = await this.deliveryCacheRepo.findOne({
      where: { key },
      relations: ['options'],
    });
    if (!entity) {
      entity = new DeliveryCache();
      entity.key = key;
    }
    entity.expiry = expiry;
    await this.deliveryCacheRepo.save(entity);

    if (entity.options?.length) {
      await this.deliveryOptionRepo.remove(entity.options);
    }

    const newOptions = options.map((opt) => {
      const optionEntity = new DeliveryOptionCache();
      optionEntity.deliveryCache = entity;
      optionEntity.delivery_platform = opt.delivery_platform;
      optionEntity.total_amount = opt.total_amount;
      optionEntity.estimated_time = opt.estimated_time ?? '';
      optionEntity.description = opt.description ?? '';
      return optionEntity;
    });
    await this.deliveryOptionRepo.save(newOptions);
  }
}
