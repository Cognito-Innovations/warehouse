import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingRequestProduct } from './shopping-request-product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

//TODO P0: Needs to rewrite return logic code
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
      id: savedProduct.id,
      shopping_request_id: savedProduct.shopping_request_id,
      name: savedProduct.name,
      description: savedProduct.description,
      unit_price:
        savedProduct.unit_price !== undefined &&
        savedProduct.unit_price !== null
          ? savedProduct.unit_price.toString()
          : undefined,
      currency: savedProduct.currency,
      quantity: savedProduct.quantity,
      url: savedProduct.url,
      size: savedProduct.size,
      color: savedProduct.color,
      variants: savedProduct.variants,
      if_not_available_quantity: savedProduct.if_not_available_quantity,
      if_not_available_color: savedProduct.if_not_available_color,
      created_at: savedProduct.created_at,
      updated_at: savedProduct.updated_at,
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
      id: updatedProduct.id,
      shopping_request_id: updatedProduct.shopping_request_id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      unit_price:
        updatedProduct.unit_price !== undefined &&
        updatedProduct.unit_price !== null
          ? updatedProduct.unit_price.toString()
          : undefined,
      currency: updatedProduct.currency,
      quantity: updatedProduct.quantity,
      url: updatedProduct.url,
      size: updatedProduct.size,
      color: updatedProduct.color,
      variants: updatedProduct.variants,
      if_not_available_quantity: updatedProduct.if_not_available_quantity,
      if_not_available_color: updatedProduct.if_not_available_color,
      available: updatedProduct.available,
      created_at: updatedProduct.created_at,
      updated_at: updatedProduct.updated_at,
    };
  }
}
