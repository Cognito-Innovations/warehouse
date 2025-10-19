import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
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

  @Get()
  findAll() {
    return this.subCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoriesService.findOne(id);
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
