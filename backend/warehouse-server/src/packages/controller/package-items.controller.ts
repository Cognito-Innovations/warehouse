import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PackageItemsService } from '../service/package-items.service';
import { PackageItemResponseDto } from '../dto/package-response.dto';
import { CreatePackageItemDto as CreatePackageItemDtoImported } from '../dto/create-package-item.dto';
import { UpdatePackageItemDto as UpdatePackageItemDtoImported } from '../dto/update-package-item.dto';

interface CreatePackageItemDto {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface UpdatePackageItemDto {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface BulkUploadDto {
  items: CreatePackageItemDto[];
}

@ApiTags('Package Items')
@Controller('packages/:package_id/items')
@UseGuards(JwtAuthGuard)
export class PackageItemsController {
  constructor(private readonly packageItemsService: PackageItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new item to a package' })
  @ApiParam({ name: 'package_id', example: 'pkg-123' })
  @ApiBody({ type: CreatePackageItemDtoImported })
  @ApiCreatedResponse({ type: PackageItemResponseDto })
  async createItem(
    @Param('package_id') package_id: string,
    @Body() createItemDto: CreatePackageItemDto,
  ) {
    return this.packageItemsService.createItem(package_id, createItemDto);
  }

  @Put(':itemId')
  @ApiOperation({ summary: 'Update an item in a package' })
  @ApiParam({ name: 'package_id', example: 'pkg-123' })
  @ApiParam({ name: 'itemId', example: 'itm-456' })
  @ApiBody({ type: UpdatePackageItemDtoImported })
  @ApiOkResponse({ type: PackageItemResponseDto })
  async updateItem(
    @Param('package_id') package_id: string,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdatePackageItemDto,
  ) {
    return this.packageItemsService.updateItem(
      package_id,
      itemId,
      updateItemDto,
    );
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Delete a package item' })
  @ApiParam({ name: 'package_id', example: 'pkg-123' })
  @ApiParam({ name: 'itemId', example: 'itm-456' })
  @ApiOkResponse({ description: 'Item deleted successfully' })
  async deleteItem(
    @Param('package_id') package_id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.packageItemsService.deleteItem(package_id, itemId);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk upload items for a package' })
  @ApiParam({ name: 'package_id', example: 'pkg-123' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/CreatePackageItemDto' },
        },
      },
    },
  })
  @ApiCreatedResponse({ type: [PackageItemResponseDto] })
  async bulkUpload(
    @Param('package_id') package_id: string,
    @Body() bulkUploadDto: BulkUploadDto,
  ) {
    return this.packageItemsService.bulkUpload(package_id, bulkUploadDto.items);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items of a package' })
  @ApiParam({ name: 'package_id', example: 'pkg-123' })
  @ApiOkResponse({ type: [PackageItemResponseDto] })
  async getItems(@Param('package_id') package_id: string) {
    return this.packageItemsService.getItems(package_id);
  }
}
