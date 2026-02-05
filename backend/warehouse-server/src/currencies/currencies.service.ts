import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './currency.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    const currency = this.currencyRepository.create({
      ...createCurrencyDto,
      rate: parseFloat(createCurrencyDto.rate.toString()),
    });
    return await this.currencyRepository.save(currency);
  }

  async findAll() {
    return await this.currencyRepository.find();
  }

  async findOne(id: string) {
    return await this.currencyRepository.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<Currency | null> {
    return await this.currencyRepository.findOne({
      where: { currency_code: code },
    });
  }

  async update(id: string, updateCurrencyDto: UpdateCurrencyDto) {
    const updateData: Partial<Currency> = {};

    if (updateCurrencyDto.name !== undefined) {
      updateData.name = updateCurrencyDto.name;
    }

    if (updateCurrencyDto.rate !== undefined) {
      updateData.rate = parseFloat(updateCurrencyDto.rate.toString());
    }

    if (updateCurrencyDto.currency_symbol !== undefined) {
      updateData.currency_symbol = updateCurrencyDto.currency_symbol;
    }

    if (updateCurrencyDto.currency_code !== undefined) {
      updateData.currency_code = updateCurrencyDto.currency_code;
    }

    await this.currencyRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: string) {
    return await this.currencyRepository.delete(id);
  }
}
