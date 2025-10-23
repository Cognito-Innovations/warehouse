import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceCategory } from '../entities/ecommerce-category.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/Countries/country.entity.js';
import { CreateCategoryDto } from '../dto/category/ecommerce-create-category.dto.js';
import { UpdateCategoryDto } from '../dto/category/ecommerce-update-category.dto.js';

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
      country: { id: country_id } as Country,
    };

    const category = this.categoryRepository.create(categoryPayload);
    return await this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.country', 'country')
      .loadRelationCountAndMap('category.products_count', 'category.products')
      .orderBy('category.name', 'ASC')
      .getMany();
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

    category.country = { id: country_id } as Country;

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
