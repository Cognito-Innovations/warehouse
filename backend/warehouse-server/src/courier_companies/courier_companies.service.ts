import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourierCompany } from './courier_company.entity';
import { CreateCourierCompanyDto } from './dto/create-courier_company.dto';
import { CourierCompanyResponsesDto } from './dto/get-all-courier_company.dto';
import { plainToInstance } from 'class-transformer';

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

  findOne(id: number) {
    return `This action returns a #${id} courierCompany`;
  }

  remove(id: number) {
    return `This action removes a #${id} courierCompany`;
  }
}
