import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PackageItem } from '../entities';
import { CreatePackageItemDto } from '../dto/create-package-item.dto';
import { UpdatePackageItemDto } from '../dto/update-package-item.dto';
import { PackageItemResponseDto } from '../dto/package-item-response.dto';

@Injectable()
export class PackageItemsService {
  constructor(
    @InjectRepository(PackageItem)
    private readonly packageItemRepository: Repository<PackageItem>,
  ) {}
  async createItem(
    package_id: string,
    createItemDto: CreatePackageItemDto,
  ): Promise<PackageItemResponseDto> {
    // For now, we'll assume the package_id is valid and proceed
    // In a real implementation, you'd verify the package exists first
    const packageItem = this.packageItemRepository.create({
      package_id: package_id,
      name: createItemDto.name,
      quantity: createItemDto.quantity,
      unit_price: createItemDto.unit_price,
      total_price: createItemDto.total_price,
    });

    const savedItem = await this.packageItemRepository.save(packageItem);

    return savedItem;
  }

  async updateItem(
    package_id: string,
    itemId: string,
    updateItemDto: UpdatePackageItemDto,
  ): Promise<PackageItemResponseDto> {
    const packageItem = await this.packageItemRepository.findOne({
      where: { id: itemId, package_id: package_id },
    });

    if (!packageItem) {
      throw new NotFoundException(`Item with id ${itemId} not found`);
    }

    packageItem.name = updateItemDto.name;
    packageItem.quantity = updateItemDto.quantity;
    packageItem.unit_price = updateItemDto.unit_price;
    packageItem.total_price = updateItemDto.total_price;

    const updatedItem = await this.packageItemRepository.save(packageItem);

    return updatedItem;
  }

  async deleteItem(
    package_id: string,
    itemId: string,
  ): Promise<{ success: boolean }> {
    const packageItem = await this.packageItemRepository.findOne({
      where: { id: itemId, package_id: package_id },
    });

    if (!packageItem) {
      throw new NotFoundException(`Item with id ${itemId} not found`);
    }

    await this.packageItemRepository.delete(itemId);

    return { success: true };
  }

  async bulkUpload(
    package_id: string,
    items: CreatePackageItemDto[],
  ): Promise<{ items: PackageItemResponseDto[] }> {
    const packageItems = items.map((item) =>
      this.packageItemRepository.create({
        package_id: package_id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }),
    );

    const savedItems = await this.packageItemRepository.save(packageItems);

    return {
      items: savedItems.map((item) => ({
        ...item
      })),
    };
  }

  async getItems(package_id: string): Promise<PackageItemResponseDto[]> {
    const items = await this.packageItemRepository.find({
      where: { package_id: package_id },
      order: { created_at: 'DESC' },
    });

    return items.map((item) => ({
      ...item
    }));
  }
}
