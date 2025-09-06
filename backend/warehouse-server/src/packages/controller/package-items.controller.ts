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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PackageItemsService } from '../service/package-items.service';


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

@Controller('packages/:package_id/items')
@UseGuards(JwtAuthGuard)
export class PackageItemsController {
  constructor(private readonly packageItemsService: PackageItemsService) {}

  @Post()
  async createItem(
    @Param('package_id') package_id: string,
    @Body() createItemDto: CreatePackageItemDto,
  ) {
    return this.packageItemsService.createItem(package_id, createItemDto);
  }

  @Put(':itemId')
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
  async deleteItem(
    @Param('package_id') package_id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.packageItemsService.deleteItem(package_id, itemId);
  }

  @Post('bulk')
  async bulkUpload(
    @Param('package_id') package_id: string,
    @Body() bulkUploadDto: BulkUploadDto,
  ) {
    return this.packageItemsService.bulkUpload(package_id, bulkUploadDto.items);
  }

  @Get()
  async getItems(@Param('package_id') package_id: string) {
    return this.packageItemsService.getItems(package_id);
  }
}
