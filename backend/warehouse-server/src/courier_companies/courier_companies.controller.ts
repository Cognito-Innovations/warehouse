import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CourierCompaniesService } from './courier_companies.service';
import { CreateCourierCompanyDto } from './dto/create-courier_company.dto';
import { CourierCompanyResponsesDto } from './dto/get-all-courier_company.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Courier Companies')
@Controller('courier-companies')
export class CourierCompaniesController {
  constructor(
    private readonly courierCompaniesService: CourierCompaniesService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new courier company' })
  @ApiResponse({
    status: 201,
    description: 'Courier company created successfully',
  })
  create(@Body() createCourierCompanyDto: CreateCourierCompanyDto) {
    return this.courierCompaniesService.create(createCourierCompanyDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all courier companies' })
  @ApiResponse({
    status: 200,
    description: 'List of all courier companies with flattened country data',
    type: [CourierCompanyResponsesDto],
  })
  async findAll(): Promise<CourierCompanyResponsesDto[]> {
    return this.courierCompaniesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get courier company by ID' })
  findOne(@Param('id') id: string) {
    return this.courierCompaniesService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete courier company' })
  remove(@Param('id') id: string) {
    return this.courierCompaniesService.remove(+id);
  }
}
