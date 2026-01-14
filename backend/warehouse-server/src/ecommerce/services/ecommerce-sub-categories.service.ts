import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceSubCategory } from '../entities/ecommerce-sub-category.entity.js';
import { EcommerceCategory } from '../entities/ecommerce-category.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country, CountryCode } from 'src/Countries/country.entity.js';
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
    const {
      // country_ids,
      category_id, ...rest } = createSubCategoryDto;

    const subCategoryPayload: Partial<EcommerceSubCategory> = {
      ...rest,
      category: { id: category_id } as EcommerceCategory,
      // countries: country_ids.map((id) => ({ id }) as Country),
    };

    const subCategory = this.subCategoryRepository.create(subCategoryPayload);
    return await this.subCategoryRepository.save(subCategory);
  }

  findAll(countryCode?: string) {
    const queryBuilder = this.subCategoryRepository
      .createQueryBuilder('subCategory')
      // TODO: Uncomment the country filter when it's required
      // .leftJoinAndSelect('subCategory.countries', 'countries')
      .leftJoinAndSelect('subCategory.category', 'category')
      .loadRelationCountAndMap(
        'subCategory.products_count',
        'subCategory.products',
      );

    // TODO: Uncomment the country filter when it's required
    // if (countryCode) {
    //   queryBuilder
    //     .innerJoinAndSelect('subCategory.countries', 'countryFilter')
    //     .andWhere('countryFilter.code = :countryCode', { countryCode });
    // }

    return queryBuilder.getMany();
  }

  async findOne(id: string, countryCode?: string) {
    const where: { id: string } = { id };
    const relations = [
      // TODO: Uncomment the country filter when it's required
      // 'countries',
      'category',
    ];

    const subCategory = await this.subCategoryRepository.findOne({
      where,
      relations,
    });

    if (!subCategory) {
      throw new NotFoundException('Sub category not found');
    }

    // TODO: Uncomment the country filter when it's required
    // if (
    //   countryCode &&
    //   !subCategory.countries.some(
    //     (c: Country) => c.code === (countryCode as CountryCode),
    //   )
    // ) {
    //   throw new NotFoundException('Sub category not available in this country');
    // }

    return subCategory;
  }

  async update(
    id: string,
    updateSubCategoryDto: UpdateEcommerceSubCategoryDto,
  ): Promise<EcommerceSubCategory> {
    const {
      // country_ids,
      category_id, ...rest } = updateSubCategoryDto;

    const subCategory = await this.subCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!subCategory) throw new NotFoundException('Sub category not found');
    this.subCategoryRepository.merge(subCategory, rest);

    subCategory.category = { id: category_id } as EcommerceCategory;

    // if (country_ids) {
    //   subCategory.countries = country_ids.map((id) => ({ id }) as Country);
    // }

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
