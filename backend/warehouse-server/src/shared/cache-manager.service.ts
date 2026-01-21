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
    let cached: T | undefined;
    try {
      cached = await this.cacheManager.get<T>(key);
    } catch (error) {
      console.warn(`Cache get failed for ${key}:`, error);
    }

    if (cached !== undefined) {
      return cached;
    }

    const now = Date.now();
    let dbValue: any;
    let expiry: number | undefined;

    if (key.startsWith('currency:') || key.startsWith('currency_code:')) {
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
    } else if (key.startsWith('delivery_rates:')) {
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

    if (dbValue) {
      const remainingMs = expiry ? expiry - now : 0;

      if (remainingMs > 0) {
        const remainingSeconds = Math.floor(remainingMs / 1000);
        try {
          await this.cacheManager.set(key, dbValue, remainingSeconds);
        } catch (error) {
          console.warn(`Cache set failed for ${key}:`, error);
        }
      }

      return dbValue as T;
    }

    return undefined;
  }

  async create<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const now = Date.now();
    const expiry = now + ttlSeconds * 1000;

    try {
      await this.cacheManager.set(key, value, ttlSeconds);
    } catch (error) {
      console.warn(`Cache set failed for ${key}:`, error);
    }

    //TODO P0: Why can't we update it everytime, because delivery rates can change anytime as per feeback i got
    if (key.startsWith('currency:') || key.startsWith('currency_code:')) {
      const currencyValue = value as CurrencyInfo;
      let entity = await this.currencyCacheRepo.findOne({ where: { key } });
      if (!entity) {
        entity = new CurrencyCache();
      }
      entity.key = key;
      entity.code = currencyValue.code;
      entity.symbol = currencyValue.symbol;
      entity.rate = currencyValue.rate;
      entity.timestamp = currencyValue.timestamp;
      entity.expiry = expiry;
      await this.currencyCacheRepo.save(entity);
    } else if (key.startsWith('delivery_rates:')) {
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

      if (entity.options && entity.options.length > 0) {
        await this.deliveryOptionRepo.remove(entity.options);
      }

      const deliveryValue = value as DeliveryOption[];
      const newOptions = deliveryValue.map((opt) => {
        const optionEntity = new DeliveryOptionCache();
        optionEntity.deliveryCache = entity;
        optionEntity.delivery_platform = opt.delivery_platform;
        optionEntity.total_amount = opt.total_amount;
        optionEntity.estimated_time = opt.estimated_time ?? '';
        optionEntity.description = opt.description ?? '';
        return optionEntity;
      });
      await this.deliveryOptionRepo.save(newOptions);
    } else {
      console.warn(`Unsupported cache key for create: ${key}`);
    }
  }
}
