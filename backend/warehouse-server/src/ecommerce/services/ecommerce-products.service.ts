import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceProduct } from '../entities/ecommerce-product.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EcommerceSubCategory } from '../entities/ecommerce-sub-category.entity.js';
import { CreateEcommerceProductDto } from '../dto/product/create-product.dto.js';
import { UpdateEcommerceProductDto } from '../dto/product/update-product.dto.js';
import { UserPreferencesService } from '../../user-preferences/user-preferences.service.js';
import { EcommerceCargoOption } from '../entities/cargo-options.entity.js';
import { EcommerceCategory } from '../entities/ecommerce-category.entity.js';
import { Country, CountryCode } from 'src/Countries/country.entity.js';
import { EcommerceMeasurement } from '../entities/measurement.entity.js';
import { DEFAULT_CURRENCY } from '../../shared/constants.js';

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  private async getCurrencyInfo(
    currency?: string,
    userId?: string,
  ): Promise<CurrencyInfo> {
    const selectedCurrency = currency || DEFAULT_CURRENCY.code;

    if (userId) {
      const userCurrency =
        await this.userPreferencesService.getUserPreferredCurrency(userId);

      if (userCurrency) {
        return userCurrency;
      }
    }

    return await this.userPreferencesService.getCurrencyInfoByCode(
      selectedCurrency,
    );
  }

  async create(
    createProductDto: CreateEcommerceProductDto,
  ): Promise<EcommerceProduct> {
    const {
      category_id,
      sub_category_id,
      country_ids,
      measurement_id,
      cargo_option_id,
      ...rest
    } = createProductDto;

    const product = this.productRepository.create({
      ...rest,
      category: { id: category_id },
      sub_category: { id: sub_category_id },
      countries: country_ids.map((id) => ({ id }) as Country),
      measurement: { id: measurement_id },
      cargo_option: { id: cargo_option_id } as EcommerceCargoOption,
    });
    return await this.productRepository.save(product);
  }

  async findAll(
    currency?: string,
    search?: string,
    category?: string,
    userId?: string,
    role?: string,
    countryCode?: string,
    limit = 20,
    offset = 0,
  ) {
    const isAdmin = role === 'admin' || role === 'super_admin';

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.countries', 'countries');

    if (isAdmin) {
      queryBuilder
        .leftJoinAndSelect('product.sub_category', 'sub_category')
        .leftJoinAndSelect('product.measurement', 'measurement')
        .leftJoinAndSelect('product.cargo_option', 'cargo_option');
    }

    if (countryCode) {
      queryBuilder.andWhere('countries.code = :countryCode', {
        countryCode,
      });
    }

    if (search?.trim()) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${search.trim()}%`,
      });
    }
    if (category?.trim()) {
      queryBuilder.andWhere('category.slug = :category', {
        category,
      });
    }

    const products = await queryBuilder
      .skip(offset)
      .take(limit)
      .orderBy('product.created_at', 'DESC')
      .getMany();

    if (isAdmin) {
      return products.map((product) => ({
        ...product,
        price: {
          price: Number(product.price),
          currency: DEFAULT_CURRENCY.symbol,
        },
      }));
    }

    const currencyInfo = await this.getCurrencyInfo(currency, userId);
    const { symbol, rate, code } = currencyInfo;

    return products.map((product) => {
      const basePrice = Number(product.price);
      const convertedPrice = Math.round(basePrice * rate * 100) / 100;

      return {
        ...product,
        price: {
          price: convertedPrice,
          currency:
            code === DEFAULT_CURRENCY.code ? DEFAULT_CURRENCY.symbol : symbol,
        },
      };
    });
  }

  async findOne(
    slug: string,
    currency?: string,
    userId?: string,
    countryCode?: string,
  ) {
    const product = await this.productRepository.findOne({
      where: { slug: slug },
      relations: ['category', 'countries'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (
      countryCode &&
      !product.countries.some(
        (c: Country) => c.code === (countryCode as CountryCode),
      )
    ) {
      throw new NotFoundException('Product not available in this country');
    }

    const currencyInfo = await this.getCurrencyInfo(currency, userId);
    const { symbol, rate, code } = currencyInfo;
    const basePrice = Number(product.price);
    const convertedPrice = Math.round(basePrice * rate * 100) / 100;

    return {
      ...product,
      price: {
        price: convertedPrice,
        currency:
          code === DEFAULT_CURRENCY.code ? DEFAULT_CURRENCY.symbol : symbol,
      },
    };
  }

  async update(
    id: string,
    updateEcommerceProductDto: UpdateEcommerceProductDto,
  ): Promise<EcommerceProduct> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    const {
      category_id,
      sub_category_id,
      country_ids,
      measurement_id,
      cargo_option_id,
      ...rest
    } = updateEcommerceProductDto;

    Object.assign(product, rest);

    if (category_id) {
      product.category = { id: category_id } as EcommerceCategory;
    }
    if (sub_category_id) {
      product.sub_category = { id: sub_category_id } as EcommerceSubCategory;
    }
    if (country_ids) {
      product.countries = country_ids.map((id) => ({ id }) as Country);
    }
    if (measurement_id) {
      product.measurement = { id: measurement_id } as EcommerceMeasurement;
    }
    if (cargo_option_id) {
      product.cargo_option = { id: cargo_option_id } as EcommerceCargoOption;
    }

    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) throw new NotFoundException('Product not found');

    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }
}
