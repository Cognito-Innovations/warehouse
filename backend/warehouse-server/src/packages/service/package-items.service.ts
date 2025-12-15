import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Package, PackageItem } from '../entities';
import { CreatePackageItemDto } from '../dto/create-package-item.dto';
import { UpdatePackageItemDto } from '../dto/update-package-item.dto';
import { PackageItemResponseDto } from '../dto/package-item-response.dto';

@Injectable()
export class PackageItemsService {
  constructor(
    @InjectRepository(PackageItem)
    private readonly packageItemRepository: Repository<PackageItem>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}
  async createItem(
    package_id: string,
    createItemDto: CreatePackageItemDto,
  ): Promise<PackageItemResponseDto> {
    const packageExists = await this.packageRepository.findOne({
      where: { id: package_id },
    });

    if (!packageExists) {
      throw new NotFoundException(`Package with id ${package_id} not found`);
    }

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

    return { items: savedItems };
  }

  async getItems(package_id: string): Promise<PackageItemResponseDto[]> {
    return this.packageItemRepository.find({
      where: { package_id: package_id },
      order: { created_at: 'DESC' },
    });
  }
}
