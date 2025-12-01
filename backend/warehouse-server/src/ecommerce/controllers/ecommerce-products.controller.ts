import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  findAll(
    @Query('country') country?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    return this.productsService.findAll(
      country,
      search,
      category,
      parsedLimit,
      parsedOffset,
    );
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string, @Query('country') country?: string) {
    return this.productsService.findOne(slug, country);
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
