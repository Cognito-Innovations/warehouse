import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceCategory } from '../entities/ecommerce-category.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country, CountryCode } from 'src/Countries/country.entity.js';
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
    const { country_ids, ...rest } = createCategoryDto;

    const categoryPayload: Partial<EcommerceCategory> = {
      ...rest,
      countries: country_ids.map((id) => ({ id }) as Country),
    };

    const category = this.categoryRepository.create(categoryPayload);
    return await this.categoryRepository.save(category);
  }

  findAll(countryCode?: string) {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.countries', 'countries')
      .loadRelationCountAndMap('category.products_count', 'category.products')
      .orderBy('category.name', 'ASC');

    if (countryCode) {
      queryBuilder
        .innerJoinAndSelect('category.countries', 'countryFilter')
        .andWhere('countryFilter.code = :countryCode', { countryCode });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, countryCode?: string) {
    const where: { id: string } = { id };
    const relations = ['countries'];

    const category = await this.categoryRepository.findOne({
      where,
      relations,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (
      countryCode &&
      !category.countries.some(
        (c: Country) => c.code === (countryCode as CountryCode),
      )
    ) {
      throw new NotFoundException('Category not available in this country');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<EcommerceCategory> {
    const { country_ids, ...rest } = updateCategoryDto;

    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    this.categoryRepository.merge(category, rest);

    if (country_ids) {
      category.countries = country_ids.map((id) => ({ id }) as Country);
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
