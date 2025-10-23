import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ProductsService } from '../services/ecommerce-products.service';
import { CreateEcommerceProductDto } from '../dto/product/create-product.dto';
import { UpdateEcommerceProductDto } from '../dto/product/update-product.dto';

@Controller('ecommerce-products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateEcommerceProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateEcommerceProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
