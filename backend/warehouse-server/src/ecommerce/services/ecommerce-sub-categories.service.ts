import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceSubCategory } from '../entities/ecommerce-sub-category.entity.js';
import { EcommerceCategory } from '../entities/ecommerce-category.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEcommerceSubCategoryDto } from '../dto/sub_category/create-sub_category.dto.js';
import { UpdateEcommerceSubCategoryDto } from '../dto/sub_category/update-sub_category.dto.js';
import { Country } from 'src/Countries/country.entity.js';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(EcommerceSubCategory)
    private readonly subCategoryRepository: Repository<EcommerceSubCategory>,
  ) {}

  async create(
    createSubCategoryDto: CreateEcommerceSubCategoryDto,
  ): Promise<EcommerceSubCategory> {
    const subCategory = this.subCategoryRepository.create({
      ...createSubCategoryDto,
      category: { id: createSubCategoryDto.category_id },
      country: { id: createSubCategoryDto.country_id },
    });
    return await this.subCategoryRepository.save(subCategory);
  }

  findAll() {
    return this.subCategoryRepository.find();
  }

  findOne(id: string) {
    return this.subCategoryRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateSubCategoryDto: UpdateEcommerceSubCategoryDto,
  ): Promise<EcommerceSubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!subCategory) throw new NotFoundException('Sub category not found');

    if (updateSubCategoryDto.category_id) {
      subCategory.category = {
        id: updateSubCategoryDto.category_id,
      } as EcommerceCategory;
    }

    if (updateSubCategoryDto.country_id) {
      subCategory.country = {
        id: updateSubCategoryDto.country_id,
      } as Country;
    }

    return await this.subCategoryRepository.save(subCategory);
  }

  async remove(id: string) {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
    });
    if (!subCategory) throw new NotFoundException('Sub category not found');

    await this.subCategoryRepository.remove(subCategory);
    return { message: 'Sub category deleted successfully' };
  }
}
