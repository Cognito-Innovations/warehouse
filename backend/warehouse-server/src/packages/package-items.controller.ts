import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { PackageItemsService } from './package-items.service';

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

@Controller('packages/:packageId/items')
export class PackageItemsController {
  constructor(private readonly packageItemsService: PackageItemsService) {}

  @Post()
  async createItem(
    @Param('packageId') packageId: string,
    @Body() createItemDto: CreatePackageItemDto,
  ) {
    return this.packageItemsService.createItem(packageId, createItemDto);
  }

  @Put(':itemId')
  async updateItem(
    @Param('packageId') packageId: string,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdatePackageItemDto,
  ) {
    return this.packageItemsService.updateItem(
      packageId,
      itemId,
      updateItemDto,
    );
  }

  @Delete(':itemId')
  async deleteItem(
    @Param('packageId') packageId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.packageItemsService.deleteItem(packageId, itemId);
  }

  @Post('bulk')
  async bulkUpload(
    @Param('packageId') packageId: string,
    @Body() bulkUploadDto: BulkUploadDto,
  ) {
    return this.packageItemsService.bulkUpload(packageId, bulkUploadDto.items);
  }

  @Get()
  async getItems(@Param('packageId') packageId: string) {
    return this.packageItemsService.getItems(packageId);
  }
}
