import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceProduct } from '../entities/ecommerce-product.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EcommerceSubCategory } from '../entities/ecommerce-sub-category.entity.js';
import { Country } from 'src/Countries/country.entity.js';
import { CreateEcommerceProductDto } from '../dto/product/create-product.dto.js';
import { UpdateEcommerceProductDto } from '../dto/product/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
  ) {}

  async create(
    createProductDto: CreateEcommerceProductDto,
  ): Promise<EcommerceProduct> {
    const {
      category_id,
      sub_category_id,
      country_id,
      measurement_id,
      ...rest
    } = createProductDto;

    const product = this.productRepository.create({
      ...rest,
      category: { id: category_id },
      sub_category: { id: sub_category_id },
      country: { id: country_id },
      measurement: { id: measurement_id },
    });
    return await this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: string) {
    return this.productRepository.findOne({ where: { id } });
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

    if (updateEcommerceProductDto.sub_category_id) {
      product.sub_category = {
        id: updateEcommerceProductDto.sub_category_id,
      } as EcommerceSubCategory;
    }
    if (updateEcommerceProductDto.country_id) {
      product.country = {
        id: updateEcommerceProductDto.country_id,
      } as Country;
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
