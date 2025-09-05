import { Body, Controller, Post, Patch, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.service.createProduct(createProductDto);
  }

  @Patch(':id/unit-price')
  async updateUnitPrice(
    @Param('id') id: string,
    @Body('unit_price') unitPrice: number,
  ): Promise<ProductResponseDto> {
    return this.service.updateUnitPrice(id, unitPrice);
  }
}
