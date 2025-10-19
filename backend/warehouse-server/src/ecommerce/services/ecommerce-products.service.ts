import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceProduct } from '../entities/ecommerce-product.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEcommerceProductDto } from '../dto/product/create-product.dto.js';
import { UpdateEcommerceProductDto } from '../dto/product/update-product.dto.js';
import { EcommerceSubCategory } from '../entities/ecommerce-sub-category.entity.js';
import { Country } from 'src/Countries/country.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
  ) {}

  async create(
    createProductDto: CreateEcommerceProductDto,
  ): Promise<EcommerceProduct> {
    const product = this.productRepository.create({
      ...createProductDto,
      category: { id: createProductDto.category_id },
      sub_category: { id: createProductDto.sub_category_id },
      country: { id: createProductDto.country_id },
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
