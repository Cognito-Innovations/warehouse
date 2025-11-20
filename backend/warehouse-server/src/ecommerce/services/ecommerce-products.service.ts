import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceProduct } from '../entities/ecommerce-product.entity.js';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EcommerceSubCategory } from '../entities/ecommerce-sub-category.entity.js';
import { Country } from 'src/Countries/country.entity.js';
import { CreateEcommerceProductDto } from '../dto/product/create-product.dto.js';
import { UpdateEcommerceProductDto } from '../dto/product/update-product.dto.js';
import { UserPreferencesService } from '../../user-preferences/user-preferences.service.js';

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
      ...rest
    } = createProductDto;

    const product = this.productRepository.create({
      ...rest,
      category: { id: category_id },
      sub_category: { id: sub_category_id },
      countries: country_ids.map((id) => ({ id }) as Country),
      measurement: { id: measurement_id },
    });
    return await this.productRepository.save(product);
  }

  async findAll(country?: string, search?: string, limit = 20, offset = 0) {
    const where: any = {};
    if (search?.trim()) {
      where.name = ILike(`%${search.trim()}%`);
    }

    const products = await this.productRepository.find({
      where,
      relations: ['category', 'sub_category', 'countries', 'measurement'],
      skip: offset,
      take: limit,
    });

    const selectedCountry = country || 'United States of America';

    return Promise.all(
      products.map(async (product) => {
        const basePrice = Number(product.price);

        const convertedPrice =
          await this.userPreferencesService.getFormattedConvertedPriceByCountry(
            selectedCountry,
            basePrice
          );

        return {
          ...product,
          price: convertedPrice,
        };
      }),
    );
  }

  async findOne(id: string, country?: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['countries'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const selectedCountry = country || 'United States of America';

    return {
      ...product,
      price:
        await this.userPreferencesService.getFormattedConvertedPriceByCountry(
          selectedCountry,
          Number(product.price),
        ),
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
