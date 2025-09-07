import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourierCompany } from './courier_company.entity';
import { CreateCourierCompanyDto } from './dto/create-courier_company.dto';

@Injectable()
export class CourierCompaniesService {
  constructor(
    @InjectRepository(CourierCompany)
    private readonly courierCompanyRepository: Repository<CourierCompany>,
  ) {}

  async create(createCourierCompanyDto: CreateCourierCompanyDto) {
    const courierCompany = this.courierCompanyRepository.create(
      createCourierCompanyDto,
    );

    const savedCourierCompany =
      await this.courierCompanyRepository.save(courierCompany);

    return savedCourierCompany;
  }

  findAll() {
    return `This action returns all courierCompanies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courierCompany`;
  }

  remove(id: number) {
    return `This action removes a #${id} courierCompany`;
  }
}
