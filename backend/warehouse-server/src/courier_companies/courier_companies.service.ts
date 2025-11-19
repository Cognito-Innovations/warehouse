import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourierCompany } from './courier_company.entity';
import { CreateCourierCompanyDto } from './dto/create-courier_company.dto';
import { CourierCompanyResponsesDto } from './dto/get-all-courier_company.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCourierCompanyDto } from './dto/update-courier_company.dto';

@Injectable()
export class CourierCompaniesService {
  constructor(
    @InjectRepository(CourierCompany)
    private readonly courierCompanyRepository: Repository<CourierCompany>,
  ) {}

  async create(createCourierCompanyDto: CreateCourierCompanyDto) {
    const courierCompany = this.courierCompanyRepository.create({
      ...createCourierCompanyDto,
      country: { id: createCourierCompanyDto.country_id },
    });

    const savedCourierCompany =
      await this.courierCompanyRepository.save(courierCompany);

    return savedCourierCompany;
  }

  async findAll() {
    const courierCompanies = await this.courierCompanyRepository.find({
      relations: ['country'],
      order: { created_at: 'DESC' },
    });

    return plainToInstance(CourierCompanyResponsesDto, courierCompanies, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateCourierCompanyDto: UpdateCourierCompanyDto) {
    const courierCompany = await this.courierCompanyRepository.preload({
      id,
      ...updateCourierCompanyDto,
      ...(updateCourierCompanyDto.country_id && {
        country: { id: updateCourierCompanyDto.country_id },
      }),
    });

    if (!courierCompany) {
      throw new NotFoundException(`Courier company with ID "${id}" not found`);
    }

    return this.courierCompanyRepository.save(courierCompany);
  }

  findOne(id: number) {
    return `This action returns a #${id} courierCompany`;
  }

  remove(id: number) {
    return `This action removes a #${id} courierCompany`;
  }
}
