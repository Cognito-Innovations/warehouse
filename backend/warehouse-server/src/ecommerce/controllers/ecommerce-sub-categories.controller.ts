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
import { SubCategoriesService } from '../services/ecommerce-sub-categories.service';
import { CreateEcommerceSubCategoryDto } from '../dto/sub_category/create-sub_category.dto';
import { UpdateEcommerceSubCategoryDto } from '../dto/sub_category/update-sub_category.dto';

@Controller('ecommerce-sub-categories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Post()
  create(@Body() createEcommerceSubCategoryDto: CreateEcommerceSubCategoryDto) {
    return this.subCategoriesService.create(createEcommerceSubCategoryDto);
  }

  @Public()
  @Get()
  findAll(@Query('countryCode') countryCode?: string) {
    return this.subCategoriesService.findAll(countryCode);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @Query('countryCode') countryCode?: string) {
    return this.subCategoriesService.findOne(id, countryCode);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEcommerceSubCategoryDto: UpdateEcommerceSubCategoryDto,
  ) {
    return this.subCategoriesService.update(id, updateEcommerceSubCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCategoriesService.remove(id);
  }
}
