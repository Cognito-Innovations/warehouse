import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceSubCategory } from '../entities/ecommerce-sub-category.entity.js';
import { EcommerceCategory } from '../entities/ecommerce-category.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/Countries/country.entity.js';
import { CreateEcommerceSubCategoryDto } from '../dto/sub_category/create-sub_category.dto.js';
import { UpdateEcommerceSubCategoryDto } from '../dto/sub_category/update-sub_category.dto.js';

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
      category: { id: category_id } as EcommerceCategory,
      country: { id: country_id } as Country,
    };

    const subCategory = this.subCategoryRepository.create(subCategoryPayload);
    return await this.subCategoryRepository.save(subCategory);
  }

  findAll() {
    return this.subCategoryRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.country', 'country')
      .leftJoinAndSelect('subCategory.category', 'category')
      .loadRelationCountAndMap(
        'subCategory.products_count',
        'subCategory.products',
      )
      .getMany();
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

    subCategory.category = { id: category_id } as EcommerceCategory;
    subCategory.country = { id: country_id } as Country;

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
