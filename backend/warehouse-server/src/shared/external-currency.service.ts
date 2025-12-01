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

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
  timestamp: number;
}

@Injectable()
export class ExternalCurrencyService {
  private readonly REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/name';
  private readonly EXCHANGE_RATE_URL = 'https://api.frankfurter.app/latest';
  private readonly TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  private readonly CACHE_TTL_SECONDS = 25 * 60 * 60; // Slightly more than 24h

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
    let cached: CurrencyInfo | undefined = await this.cacheManager.get<CurrencyInfo>(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < this.TWENTY_FOUR_HOURS_MS) {
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
    let dbCountryId: string | null = null;

    if (!isSupported) {
      // Fallback to USD
      code = 'USD';
      symbol = '$';
      rate = 1;

      // Find USA for DB update
      const usaCountry = await this.countryRepository.findOne({
        where: { name: ILike('United States of America') },
      });
      if (usaCountry) {
        dbCountryId = usaCountry.id;
      }
    } else {
      dbCountryId = supportedCountry.id;
      try {
        // Fetch currency code and symbol from REST Countries
        const countryResponse = await firstValueFrom(
          this.httpService.get(`${this.REST_COUNTRIES_URL}/${encodeURIComponent(trimmedCountryName)}?fullText=true`),
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
        symbol = currInfo.symbol || '';

        // Fetch exchange rate (local currency units per USD)
        const rateResponse = await firstValueFrom(
          this.httpService.get(`${this.EXCHANGE_RATE_URL}?from=USD&to=${code}`),
        );
        const rateData = rateResponse.data;

        if (!rateData.rates || typeof rateData.rates[code] !== 'number') {
          throw new Error(`No exchange rate found for ${code}`);
        }
        rate = rateData.rates[code]; // Local per USD
      } catch (error) {
        // Fallback to USD
        code = 'USD';
        symbol = '$';
        rate = 1;
      }
    }

    const currencyInfo: CurrencyInfo = {
      code,
      symbol,
      rate,
      timestamp: now,
    };
    // Store in Redis
    await this.cacheManager.set(cacheKey, currencyInfo, this.CACHE_TTL_SECONDS);

    // Update DB
    if (dbCountryId) {
      this.updateCountryCurrencyRecord(dbCountryId, code, symbol, rate);
    }

    return currencyInfo;
  }

  private async updateCountryCurrencyRecord(
    countryId: string,
    code: string,
    symbol: string,
    rate: number,
  ): Promise<void> {
    try {
      const existing = await this.currenciesService.findByCountry(countryId);
      if (existing) {
        const updateDto: UpdateCurrencyDto = {
          currency_symbol: symbol,
          currency_code: code,
          rate,
        };
        await this.currenciesService.update(existing.id, updateDto);
      } else {
        const createDto: CreateCurrencyDto = {
          country: countryId,
          currency_symbol: symbol,
          currency_code: code,
          rate,
        };
        await this.currenciesService.create(createDto);
      }
    } catch (err) {
      console.error(
        `Background DB update failed for country ID ${countryId}:`,
        err
      );
    }
  }
}