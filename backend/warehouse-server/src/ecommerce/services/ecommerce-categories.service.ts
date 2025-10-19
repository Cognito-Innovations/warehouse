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
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      country: { id: createCategoryDto.country_id },
    });
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
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    if (updateCategoryDto.country_id) {
      category.country = {
        id: updateCategoryDto.country_id,
      } as Country;
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
