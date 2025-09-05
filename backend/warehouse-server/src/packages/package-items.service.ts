import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackageItem } from './entities/package-item.entity';
import { CreatePackageItemDto } from './dto/create-package-item.dto';
import { UpdatePackageItemDto } from './dto/update-package-item.dto';
import { PackageItemResponseDto } from './dto/package-item-response.dto';

@Injectable()
export class PackageItemsService {
  constructor(
    @InjectRepository(PackageItem)
    private readonly packageItemRepository: Repository<PackageItem>,
  ) {}
  async createItem(
    packageId: string,
    createItemDto: CreatePackageItemDto,
  ): Promise<PackageItemResponseDto> {
    // For now, we'll assume the packageId is valid and proceed
    // In a real implementation, you'd verify the package exists first
    const packageItem = this.packageItemRepository.create({
      package_id: packageId,
      name: createItemDto.name,
      quantity: createItemDto.quantity,
      unit_price: createItemDto.unit_price,
      total_price: createItemDto.total_price,
    });

    const savedItem = await this.packageItemRepository.save(packageItem);

    return {
      id: savedItem.id,
      package_id: savedItem.package_id,
      name: savedItem.name,
      quantity: savedItem.quantity,
      unit_price: savedItem.unit_price,
      total_price: savedItem.total_price,
      created_at: savedItem.created_at,
      updated_at: savedItem.updated_at,
    };
  }

  async updateItem(
    packageId: string,
    itemId: string,
    updateItemDto: UpdatePackageItemDto,
  ): Promise<PackageItemResponseDto> {
    const packageItem = await this.packageItemRepository.findOne({
      where: { id: itemId, package_id: packageId },
    });

    if (!packageItem) {
      throw new NotFoundException(`Item with id ${itemId} not found`);
    }

    packageItem.name = updateItemDto.name;
    packageItem.quantity = updateItemDto.quantity;
    packageItem.unit_price = updateItemDto.unit_price;
    packageItem.total_price = updateItemDto.total_price;

    const updatedItem = await this.packageItemRepository.save(packageItem);

    return {
      id: updatedItem.id,
      package_id: updatedItem.package_id,
      name: updatedItem.name,
      quantity: updatedItem.quantity,
      unit_price: updatedItem.unit_price,
      total_price: updatedItem.total_price,
      created_at: updatedItem.created_at,
      updated_at: updatedItem.updated_at,
    };
  }

  async deleteItem(
    packageId: string,
    itemId: string,
  ): Promise<{ success: boolean }> {
    const packageItem = await this.packageItemRepository.findOne({
      where: { id: itemId, package_id: packageId },
    });

    if (!packageItem) {
      throw new NotFoundException(`Item with id ${itemId} not found`);
    }

    await this.packageItemRepository.delete(itemId);

    return { success: true };
  }

  async bulkUpload(
    packageId: string,
    items: CreatePackageItemDto[],
  ): Promise<{ items: PackageItemResponseDto[] }> {
    const packageItems = items.map((item) =>
      this.packageItemRepository.create({
        package_id: packageId,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }),
    );

    const savedItems = await this.packageItemRepository.save(packageItems);

    return {
      items: savedItems.map((item) => ({
        id: item.id,
        package_id: item.package_id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),
    };
  }

  async getItems(packageId: string): Promise<PackageItemResponseDto[]> {
    const items = await this.packageItemRepository.find({
      where: { package_id: packageId },
      order: { created_at: 'DESC' },
    });

    return items.map((item) => ({
      id: item.id,
      package_id: item.package_id,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  }
}
