import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CacheManagerService } from './cache-manager.service';
import { Country } from '../Countries/country.entity';
import {
  BASE_EXCHANGE_CURRENCY,
  CACHE_TTL_SECONDS,
  CURRENCY_SYMBOL_MAP,
  DEFAULT_CURRENCY,
  EXCHANGE_RATE_URL,
  INR_CURRENCY_CODE,
  REST_COUNTRIES_CURRENCY_URL,
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
    private httpService: HttpService,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    private cacheService: CacheManagerService,
  ) {}

  private async isCountrySupported(countryName: string): Promise<boolean> {
    const supportedCountry = await this.countryRepository.findOne({
      where: { name: ILike(countryName) },
    });
    return !!supportedCountry;
  }

  private async fetchCountryCurrencyData(
    countryName: string,
  ): Promise<{ code: string; symbol: string; name: string }> {
    const countryResponse = await firstValueFrom(
      this.httpService.get<RestCountry[]>(
        `${REST_COUNTRIES_URL}/${encodeURIComponent(countryName)}?fullText=true`,
      ),
    );
    const countryData = countryResponse.data;
    if (!countryData || countryData.length === 0) {
      throw new Error(`No data found for country: ${countryName}`);
    }

    const currenciesObj = countryData[0].currencies;
    if (!currenciesObj || Object.keys(currenciesObj).length === 0) {
      throw new Error(`No currencies found for ${countryName}`);
    }

    const code = Object.keys(currenciesObj)[0];
    const currInfo = currenciesObj[code];
    return {
      code,
      symbol: currInfo?.symbol ?? '',
      name: currInfo?.name ?? '',
    };
  }

  private async fetchCurrencyDetailsByCode(
    code: string,
  ): Promise<{ symbol: string; name: string }> {
    const countryResponse = await firstValueFrom(
      this.httpService.get<RestCountry[]>(
        `${REST_COUNTRIES_CURRENCY_URL}/${code}`,
      ),
    );
    const countries = countryResponse.data;
    if (countries && countries.length > 0) {
      const currInfo = countries[0].currencies?.[code];
      if (currInfo) {
        return {
          symbol: currInfo.symbol ?? '',
          name: currInfo.name ?? '',
        };
      }
    }
    throw new Error(`No details found for currency: ${code}`);
  }

  private async fetchExchangeRate(code: string): Promise<number> {
    if (code === BASE_EXCHANGE_CURRENCY) {
      return 1;
    }
    const rateResponse = await firstValueFrom(
      this.httpService.get<ExchangeRateResponse>(
        `${EXCHANGE_RATE_URL}?from=${BASE_EXCHANGE_CURRENCY}&to=${code}`,
      ),
    );
    const rateData = rateResponse.data;
    if (!rateData.rates || typeof rateData.rates[code] !== 'number') {
      throw new Error(`No exchange rate found for ${code}`);
    }
    return rateData.rates[code];
  }

  private getFallbackCurrencyInfo(): {
    code: string;
    symbol: string;
    rate: number;
    name: string;
  } {
    return {
      code: DEFAULT_CURRENCY.code,
      symbol: DEFAULT_CURRENCY.symbol,
      rate: DEFAULT_CURRENCY.rate,
      name: 'US Dollar',
    };
  }

  async getCurrencyInfo(countryName: string): Promise<CurrencyInfo> {
    const trimmedCountryName = countryName.trim();
    const cacheKey = `currency:${trimmedCountryName.toLowerCase()}`;

    const cached = await this.cacheService.get<CurrencyInfo>(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < TWENTY_FOUR_HOURS_MS) {
      return cached;
    }

    const isSupported = await this.isCountrySupported(trimmedCountryName);

    let code: string;
    let symbol: string;
    let rate: number;
    let currencyName: string;

    if (!isSupported) {
      ({
        code,
        symbol,
        rate,
        name: currencyName,
      } = this.getFallbackCurrencyInfo());
    } else {
      try {
        const {
          code: fetchedCode,
          symbol: fetchedSymbol,
          name: fetchedName,
        } = await this.fetchCountryCurrencyData(trimmedCountryName);
        code = fetchedCode;
        symbol = fetchedSymbol;
        currencyName = fetchedName;
        rate = await this.fetchExchangeRate(code);
      } catch (error) {
        console.log('Fallback to USD:', error);
        ({
          code,
          symbol,
          rate,
          name: currencyName,
        } = this.getFallbackCurrencyInfo());
      }
    }

    const currencyInfo: CurrencyInfo = {
      code,
      symbol,
      rate,
      timestamp: now,
    };
    await this.cacheService.create(cacheKey, currencyInfo, CACHE_TTL_SECONDS);

    return currencyInfo;
  }

  async getCurrencyInfoByCode(currencyCode: string): Promise<CurrencyInfo> {
    const code = currencyCode.toUpperCase();
    const cacheKey = `currency_code:${code.toLowerCase()}`;
    const cached = await this.cacheService.get<CurrencyInfo>(cacheKey);
    const now = Date.now();
    //TODO P0: This might be incorrrect, add this into doc, will discuss on it
    if (cached && now - cached.timestamp < TWENTY_FOUR_HOURS_MS) {
      return cached;
    }
    let symbol = '';
    let name = '';
    let rate: number = DEFAULT_CURRENCY.rate;

    try {
      ({ symbol, name } = await this.fetchCurrencyDetailsByCode(code));
    } catch (error) {
      console.error(`Failed to fetch symbol/name for ${code}:`, error);
    }

    try {
      rate = await this.fetchExchangeRate(code);
    } catch (error) {
      console.error(`Failed to fetch rate for ${code}:`, error);
    }

    // Fallbacks
    symbol = symbol || (CURRENCY_SYMBOL_MAP[code] ?? DEFAULT_CURRENCY.symbol);
    name = name || (code === DEFAULT_CURRENCY.code ? 'US Dollar' : 'Unknown');

    const currencyInfo: CurrencyInfo = { code, symbol, rate, timestamp: now };
    await this.cacheService.create(cacheKey, currencyInfo, CACHE_TTL_SECONDS);

    return currencyInfo;
  }

  async convertFromINR(
    amountInINR: number,
    targetCurrencyCode: string,
  ): Promise<number> {
    const upperCode = targetCurrencyCode.toUpperCase();

    if (upperCode === INR_CURRENCY_CODE) {
      return amountInINR;
    }

    try {
      const targetCurrencyInfo = await this.getCurrencyInfoByCode(upperCode);

      const inrCurrencyInfo =
        await this.getCurrencyInfoByCode(INR_CURRENCY_CODE);

      if (!inrCurrencyInfo || !inrCurrencyInfo.rate) {
        console.error(
          `Conversion failed: Unable to fetch rate for ${INR_CURRENCY_CODE}`,
        );
        return amountInINR;
      }

      const amountInBase = amountInINR / inrCurrencyInfo.rate;
      const convertedAmount = amountInBase * targetCurrencyInfo.rate;

      return parseFloat(convertedAmount.toFixed(2));
    } catch (error) {
      console.error(
        `Currency conversion error from INR to ${upperCode}:`,
        error,
      );
      return amountInINR;
    }
  }
}
