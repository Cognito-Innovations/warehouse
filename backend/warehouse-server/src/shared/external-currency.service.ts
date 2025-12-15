import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Country } from '../Countries/country.entity';
import { CreateCurrencyDto } from 'src/currencies/dto/create-currency.dto';
import { UpdateCurrencyDto } from 'src/currencies/dto/update-currency.dto';
import { CurrenciesService } from 'src/currencies/currencies.service';
import {
  BASE_EXCHANGE_CURRENCY,
  CACHE_TTL_SECONDS,
  DEFAULT_CURRENCY,
  EXCHANGE_RATE_URL,
  REST_COUNTRIES_URL,
  TWENTY_FOUR_HOURS_MS,
} from './constants';

interface RestCountryCurrency {
  name?: string;
  symbol?: string;
}

interface RestCountry {
  currencies?: Record<string, RestCountryCurrency>;
}

interface ExchangeRateResponse {
  rates: Record<string, number>;
}

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
  timestamp: number;
}

@Injectable()
export class ExternalCurrencyService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    private currenciesService: CurrenciesService,
  ) {}

  async getCurrencyInfo(countryName: string): Promise<CurrencyInfo> {
    const trimmedCountryName = countryName.trim();
    const cacheKey = `currency:${trimmedCountryName.toLowerCase()}`;

    // Check cache first
    const cached = await this.cacheManager.get<CurrencyInfo>(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < TWENTY_FOUR_HOURS_MS) {
      return cached;
    }

    // Check if country is supported
    const supportedCountry = await this.countryRepository.findOne({
      where: { name: ILike(trimmedCountryName) },
    });
    const isSupported = !!supportedCountry;

    let code: string;
    let symbol: string;
    let rate: number;
    let currencyName: string;

    if (!isSupported) {
      // Fallback to USD
      code = DEFAULT_CURRENCY.code;
      symbol = DEFAULT_CURRENCY.symbol;
      rate = DEFAULT_CURRENCY.rate;
      currencyName = 'US Dollar';
    } else {
      try {
        // Fetch currency code, symbol and name from REST Countries
        const countryResponse = await firstValueFrom(
          this.httpService.get<RestCountry[]>(
            `${REST_COUNTRIES_URL}/${encodeURIComponent(trimmedCountryName)}?fullText=true`,
          ),
        );
        const countryData = countryResponse.data;
        if (!countryData || countryData.length === 0) {
          throw new Error(`No data found for country: ${trimmedCountryName}`);
        }

        const currenciesObj = countryData[0].currencies;
        if (!currenciesObj || Object.keys(currenciesObj).length === 0) {
          throw new Error(`No currencies found for ${trimmedCountryName}`);
        }

        const currCode = Object.keys(currenciesObj)[0];
        code = currCode;
        const currInfo = currenciesObj[currCode];
        symbol = currInfo?.symbol ?? '';
        currencyName = currInfo?.name ?? '';

        // Fetch exchange rate (local currency units per USD)
        const rateResponse = await firstValueFrom(
          this.httpService.get<ExchangeRateResponse>(
            `${EXCHANGE_RATE_URL}?from=${BASE_EXCHANGE_CURRENCY}&to=${code}`,
          ),
        );
        const rateData = rateResponse.data;

        if (!rateData.rates || typeof rateData.rates[code] !== 'number') {
          throw new Error(`No exchange rate found for ${code}`);
        }
        rate = rateData.rates[code]; // Local per USD
      } catch (error) {
        console.log('Fallback to USD:', error);
        // Fallback to USD
        code = DEFAULT_CURRENCY.code;
        symbol = DEFAULT_CURRENCY.symbol;
        rate = DEFAULT_CURRENCY.rate;
        currencyName = 'US Dollar';
      }
    }

    const currencyInfo: CurrencyInfo = {
      code,
      symbol,
      rate,
      timestamp: now,
    };
    // Store in Redis
    await this.cacheManager.set(cacheKey, currencyInfo, CACHE_TTL_SECONDS);

    // Update DB
    await this.updateCurrencyRecord(code, symbol, rate, currencyName);

    return currencyInfo;
  }

  private async updateCurrencyRecord(
    code: string,
    symbol: string,
    rate: number,
    name: string,
  ): Promise<void> {
    try {
      const existing = await this.currenciesService.findByCode(code);
      if (existing) {
        const updateDto: UpdateCurrencyDto = {
          name,
          currency_symbol: symbol,
          currency_code: code,
          rate,
        };
        await this.currenciesService.update(existing.id, updateDto);
      } else {
        const createDto: CreateCurrencyDto = {
          name,
          currency_symbol: symbol,
          currency_code: code,
          rate,
        };
        await this.currenciesService.create(createDto);
      }
    } catch (err) {
      console.error(`Background DB update failed for currency ${code}:`, err);
    }
  }
}
