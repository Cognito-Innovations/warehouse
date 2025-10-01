import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CourierCompaniesService } from './courier_companies.service';
import { CreateCourierCompanyDto } from './dto/create-courier_company.dto';
import { CourierCompanyResponsesDto } from './dto/get-all-courier_company.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateCourierCompanyDto } from './dto/update-courier_company.dto';

@ApiTags('Courier Companies')
@Controller('courier-companies')
export class CourierCompaniesController {
  constructor(
    private readonly courierCompaniesService: CourierCompaniesService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new courier company' })
  @ApiCreatedResponse({
    description: 'Courier company created successfully',
    type: CourierCompanyResponsesDto,
  })
  @ApiBody({
    type: CreateCourierCompanyDto,
    examples: {
      FedEx: {
        summary: 'Example for FedEx',
        value: {
          name: 'FedEx',
          address: '123 FedEx Street, New York, USA',
          phone_number: '+1-555-1234',
          email: 'support@fedex.com',
          country_id: 'uuid-of-country',
          is_active: true,
        },
      },
    },
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

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a courier company' })
  @ApiOkResponse({
    description: 'Courier company updated successfully',
    type: CourierCompanyResponsesDto,
  })
  @ApiBody({ type: UpdateCourierCompanyDto })
  update(
    @Param('id') id: string,
    @Body() updateCourierCompanyDto: UpdateCourierCompanyDto,
  ) {
    return this.courierCompaniesService.update(id, updateCourierCompanyDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get courier company by ID' })
  @ApiOkResponse({
    description: 'Details of a courier company',
    type: CourierCompanyResponsesDto,
  })
  findOne(@Param('id') id: string) {
    return this.courierCompaniesService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete courier company by ID' })
  @ApiResponse({
    status: 200,
    description: 'Courier company deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.courierCompaniesService.remove(+id);
  }
}
