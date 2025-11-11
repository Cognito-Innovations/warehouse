import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceCategory } from '../entities/ecommerce-category.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/Countries/country.entity.js';
import { CreateCategoryDto } from '../dto/category/ecommerce-create-category.dto.js';
import { UpdateCategoryDto } from '../dto/category/ecommerce-update-category.dto.js';
import { EcommerceCargoOption } from '../entities/cargo-options.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(EcommerceCategory)
    private readonly categoryRepository: Repository<EcommerceCategory>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<EcommerceCategory> {
    const { country_ids, cargo_option_id, ...rest } = createCategoryDto;

    const categoryPayload: Partial<EcommerceCategory> = {
      ...rest,
      cargo_option: { id: cargo_option_id } as EcommerceCargoOption,
      countries: country_ids.map((id) => ({ id }) as Country),
    };

    const category = this.categoryRepository.create(categoryPayload);
    return await this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.countries', 'countries')
      .leftJoinAndSelect('category.cargo_option', 'cargo_option')
      .loadRelationCountAndMap('category.products_count', 'category.products')
      .orderBy('category.name', 'ASC')
      .getMany();
  }

  findOne(id: string) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['countries', 'cargo_option'],
    });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<EcommerceCategory> {
    const { country_ids, cargo_option_id, ...rest } = updateCategoryDto;

    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    this.categoryRepository.merge(category, rest);

    if (cargo_option_id) {
      category.cargo_option = { id: cargo_option_id } as EcommerceCargoOption;
    }

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
