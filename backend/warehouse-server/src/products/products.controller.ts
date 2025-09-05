import { Body, Controller, Post, Patch, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.service.createProduct(body);
  }

   @Patch(':id/unit-price')
  async updateUnitPrice(
    @Param('id') id: string,
    @Body('unit_price') unitPrice: number,
  ) {
    return this.service.updateUnitPrice(id, unitPrice);
  }
}