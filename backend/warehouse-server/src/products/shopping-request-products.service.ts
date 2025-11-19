import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingRequestProduct } from './shopping-request-product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ShoppingRequestProductsService {
  constructor(
    @InjectRepository(ShoppingRequestProduct)
    private readonly productRepository: Repository<ShoppingRequestProduct>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = this.productRepository.create({
      ...createProductDto,
      quantity: createProductDto.quantity || 1,
      currency: createProductDto.currency || 'US',
    });

    const savedProduct = await this.productRepository.save(product);

    return {
      ...savedProduct,
      unit_price:
        savedProduct.unit_price !== undefined &&
        savedProduct.unit_price !== null
          ? savedProduct.unit_price.toString()
          : undefined,
    };
  }

  async updateProduct(
    id: string,
    updates: { unit_price?: number; available?: boolean; currency?: string },
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (updates.unit_price !== undefined) {
      product.unit_price = updates.unit_price;
    }
    if (updates.available !== undefined) {
      product.available = updates.available;
    }
    if (updates.currency !== undefined) {
      product.currency = updates.currency;
    }

    const updatedProduct = await this.productRepository.save(product);

    return {
      ...updatedProduct,
      unit_price:
        updatedProduct.unit_price !== undefined &&
        updatedProduct.unit_price !== null
          ? updatedProduct.unit_price.toString()
          : undefined,
    };
  }
}
