import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RacksService } from './racks.service';
import { CreateRackDto } from './dto/create-rack.dto';
import { RackResponseDto } from './dto/rack-response.dto';

@ApiTags('Racks')
@Controller('racks')
@UseGuards(JwtAuthGuard)
export class RacksController {
  constructor(private readonly racksService: RacksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rack' })
  @ApiCreatedResponse({
    description: 'Rack created successfully',
    type: RackResponseDto,
  })
  @ApiBody({
    type: CreateRackDto,
    examples: {
      Example1: {
        summary: 'Simple Rack',
        value: {
          label: 'Rack A1',
          color: 'Blue',
          count: 10,
        },
      },
    },
  })
  async create(@Body() createRackDto: CreateRackDto): Promise<RackResponseDto> {
    return this.racksService.createRack(createRackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all racks (sorted by label)' })
  @ApiOkResponse({
    description: 'List of racks',
    type: [RackResponseDto],
  })
  async findAll(): Promise<RackResponseDto[]> {
    return this.racksService.getAllRacks();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a rack by ID' })
  @ApiOkResponse({
    description: 'Rack updated successfully',
    type: RackResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Rack not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        label: { type: 'string', example: 'Rack B2' },
        color: { type: 'string', example: 'Red' },
        count: { type: 'number', example: 20 },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateRackDto>,
  ): Promise<RackResponseDto> {
    return this.racksService.updateRack(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rack by ID' })
  @ApiOkResponse({
    description: 'Rack deleted successfully',
    schema: {
      example: { success: true },
    },
  })
  @ApiResponse({ status: 404, description: 'Rack not found' })
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.racksService.deleteRack(id);
  }
}
