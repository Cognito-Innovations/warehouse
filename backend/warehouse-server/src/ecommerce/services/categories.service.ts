import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../entities/category.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '../dto/category/create-category.dto.js';
import { UpdateCategoryDto } from '../dto/category/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
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
  ): Promise<UpdateCategoryDto> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    return await this.categoryRepository.save(updateCategoryDto);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
