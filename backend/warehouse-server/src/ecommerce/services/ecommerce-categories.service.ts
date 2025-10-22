import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceCategory } from '../entities/ecommerce-category.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '../dto/category/ecommerce-create-category.dto.js';
import { UpdateCategoryDto } from '../dto/category/ecommerce-update-category.dto.js';
import { Country } from 'src/Countries/country.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(EcommerceCategory)
    private readonly categoryRepository: Repository<EcommerceCategory>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<EcommerceCategory> {
    const { country_id, ...rest } = createCategoryDto;

    const categoryPayload: Partial<EcommerceCategory> = {
      ...rest,
    };

    if (country_id) {
      categoryPayload.country = { id: country_id } as Country;
    }

    const category = this.categoryRepository.create(categoryPayload);
    return await this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: string) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<EcommerceCategory> {
    const { country_id, ...rest } = updateCategoryDto;

    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    this.categoryRepository.merge(category, rest);

    if (country_id! in updateCategoryDto) {
      if (updateCategoryDto.country_id === null) {
        category.country = null;
      } else if (typeof updateCategoryDto.country_id === 'string') {
        category.country = { id: updateCategoryDto.country_id } as Country;
      }
    }

    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');

    await this.categoryRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
