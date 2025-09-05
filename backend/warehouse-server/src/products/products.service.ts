import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = this.productRepository.create({
      ...createProductDto,
      quantity: createProductDto.quantity || 1,
    });

    const savedProduct = await this.productRepository.save(product);

    return {
      id: savedProduct.id,
      shopping_request_id: savedProduct.shopping_request_id,
      name: savedProduct.name,
      description: savedProduct.description,
      unit_price: savedProduct.unit_price,
      quantity: savedProduct.quantity,
      url: savedProduct.url,
      created_at: savedProduct.created_at,
      updated_at: savedProduct.updated_at,
    };
  }

  async updateUnitPrice(
    id: string,
    unitPrice: number,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    product.unit_price = unitPrice;
    const updatedProduct = await this.productRepository.save(product);

    return {
      id: updatedProduct.id,
      shopping_request_id: updatedProduct.shopping_request_id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      unit_price: updatedProduct.unit_price,
      quantity: updatedProduct.quantity,
      url: updatedProduct.url,
      created_at: updatedProduct.created_at,
      updated_at: updatedProduct.updated_at,
    };
  }
}
