import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CourierCompaniesService } from './courier_companies.service';
import { CreateCourierCompanyDto } from './dto/create-courier_company.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('courier-companies')
export class CourierCompaniesController {
  constructor(
    private readonly courierCompaniesService: CourierCompaniesService,
  ) {}

  @Public()
  @Post()
  create(@Body() createCourierCompanyDto: CreateCourierCompanyDto) {
    return this.courierCompaniesService.create(createCourierCompanyDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.courierCompaniesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courierCompaniesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courierCompaniesService.remove(+id);
  }
}
