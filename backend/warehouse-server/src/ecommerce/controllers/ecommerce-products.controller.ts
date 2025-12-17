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
    @Query('currency') currency?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('user_id') userId?: string,
    @Query('role') role?: string,
    @Query('countryCode') countryCode?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    return this.productsService.findAll(
      currency,
      search,
      category,
      userId,
      role,
      countryCode,
      parsedLimit,
      parsedOffset,
    );
  }

  @Public()
  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
    @Query('currency') currency?: string,
    @Query('user_id') userId?: string,
    @Query('countryCode') countryCode?: string,
  ) {
    return this.productsService.findOne(slug, currency, userId, countryCode);
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
