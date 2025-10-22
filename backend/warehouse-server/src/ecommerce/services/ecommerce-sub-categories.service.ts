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
    const { country_id, category_id, ...rest } = createSubCategoryDto;

    const subCategoryPayload: Partial<EcommerceSubCategory> = {
      ...rest,
    };

    if (country_id) {
      subCategoryPayload.country = { id: country_id } as Country;
    }

    if (category_id) {
      subCategoryPayload.category = { id: category_id } as EcommerceCategory;
    }

    const subCategory = this.subCategoryRepository.create(subCategoryPayload);
    return await this.subCategoryRepository.save(subCategory);
  }

  findAll() {
    return this.subCategoryRepository.find({
      relations: ['category'],
    });
  }

  findOne(id: string) {
    return this.subCategoryRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateSubCategoryDto: UpdateEcommerceSubCategoryDto,
  ): Promise<EcommerceSubCategory> {
    const { country_id, category_id, ...rest } = updateSubCategoryDto;

    const subCategory = await this.subCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!subCategory) throw new NotFoundException('Sub category not found');
    this.subCategoryRepository.merge(subCategory, rest);

    if (category_id) {
      subCategory.category = {
        id: category_id,
      } as EcommerceCategory;
    }

    if (country_id! in updateSubCategoryDto) {
      if (updateSubCategoryDto.country_id === null) {
        subCategory.country = null;
      } else if (typeof updateSubCategoryDto.country_id === 'string') {
        subCategory.country = {
          id: updateSubCategoryDto.country_id
        } as Country;
      }
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
