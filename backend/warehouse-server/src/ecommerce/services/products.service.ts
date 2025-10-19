import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceProduct } from '../entities/product.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from '../dto/product/create-product.dto.js';
import { UpdateProductDto } from '../dto/product/update-product.dto.js';
import { Category } from '../entities/category.entity.js';
import { SubCategory } from '../entities/sub_category.entity.js';
import { Country } from 'src/Countries/country.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<EcommerceProduct> {
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
    updateProductDto: UpdateProductDto,
  ): Promise<EcommerceProduct> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    if (updateProductDto.category_id) {
      product.category = {
        id: updateProductDto.category_id,
      } as Category;
    }
    if (updateProductDto.sub_category_id) {
      product.sub_category = {
        id: updateProductDto.sub_category_id,
      } as SubCategory;
    }
    if (updateProductDto.country_id) {
      product.country = {
        id: updateProductDto.country_id,
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
