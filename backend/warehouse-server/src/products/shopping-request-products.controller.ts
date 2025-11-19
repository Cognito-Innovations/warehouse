import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShoppingRequestProductsService } from './shopping-request-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('Shopping Request Products')
@Controller('shopping-request-products')
@UseGuards(JwtAuthGuard)
export class ShoppingRequestProductsController {
  constructor(private readonly service: ShoppingRequestProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product under a shopping request' })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      Example1: {
        summary: 'Simple Product',
        value: {
          shopping_request_id: 'uuid-of-shopping-request',
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse with USB receiver',
          unit_price: 25.5,
          quantity: 2,
          url: 'https://example.com/mouse',
        },
      },
    },
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.service.createProduct(createProductDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product details (price or availability)' })
  @ApiOkResponse({
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        unit_price: {
          type: 'number',
          example: 30.0,
          description: 'Updated unit price of the product',
        },
        available: {
          type: 'boolean',
          example: true,
          description: 'Whether the product is available or not',
        },
      },
    },
  })
  async updateProduct(
    @Param('id') id: string,
    @Body()
    body: {
      unit_price?: number;
      available?: boolean;
      currency?: string;
    },
  ): Promise<ProductResponseDto> {
    return this.service.updateProduct(id, body);
  }
}
