import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceProduct } from '../entities/ecommerce-product.entity.js';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EcommerceSubCategory } from '../entities/ecommerce-sub-category.entity.js';
import { Country } from 'src/Countries/country.entity.js';
import { CreateEcommerceProductDto } from '../dto/product/create-product.dto.js';
import { UpdateEcommerceProductDto } from '../dto/product/update-product.dto.js';
import { UserPreferencesService } from '../../user-preferences/user-preferences.service.js';
import { EcommerceCargoOption } from '../entities/cargo-options.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

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
    country?: string,
    search?: string,
    category?: string,
    limit = 20,
    offset = 0,
  ) {
    const where: any = {};
    if (search?.trim()) {
      where.name = ILike(`%${search.trim()}%`);
    }
    if (category?.trim()) {
      where.category = { id: category };
    }

    const products = await this.productRepository.find({
      where,
      relations: ['category', 'sub_category', 'measurement'],
      skip: offset,
      take: limit,
    });

    const selectedCountry = country || 'United States of America';

    const currencyInfo =
      await this.userPreferencesService.getCurrencyRateInfo(selectedCountry);

    const { code, symbol, rate } = currencyInfo;

    return products.map((product) => {
      const basePrice = Number(product.price);

      const convertedPrice = code === 'USD' ? basePrice : basePrice * rate;
      const finalCurrencySymbol = code === 'USD' ? '$' : symbol;

      return {
        ...product,
        price: {
          price: convertedPrice,
          currency: finalCurrencySymbol
        },
      };
    });
  }

  async findOne(slug: string, country?: string) {
    const product = await this.productRepository.findOne({
      where: { slug: slug },
      relations: ['countries', 'cargo_option'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const selectedCountry = country || 'United States of America';

    const convertedPriceObj =
      await this.userPreferencesService.getFormattedConvertedPriceByCountry(
        selectedCountry,
        Number(product.price),
      );

    return {
      ...product,
      price: convertedPriceObj
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
      product.category = { id: category_id } as any;
    }
    if (sub_category_id) {
      product.sub_category = { id: sub_category_id } as EcommerceSubCategory;
    }
    if (country_ids) {
      product.countries = country_ids.map((id) => ({ id }) as Country);
    }
    if (measurement_id) {
      product.measurement = { id: measurement_id } as any;
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
