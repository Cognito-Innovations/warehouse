import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentExportBox } from './shipment-export-box.entity';
import { ShipmentExport } from './shipment-export.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { Package } from 'src/packages/entities';

@Injectable()
export class ShipmentExportBoxesService {
  constructor(
    @InjectRepository(ShipmentExportBox)
    private readonly boxRepo: Repository<ShipmentExportBox>,
    @InjectRepository(ShipmentExport)
    private readonly exportRepo: Repository<ShipmentExport>,
    @InjectRepository(Package)
    private readonly packageRepo: Repository<Package>,
  ) {}

  async createBox(
    exportId: string,
    dto: CreateBoxDto,
  ): Promise<ShipmentExportBox> {
    const exp = await this.exportRepo.findOne({ where: { id: exportId } });
    if (!exp)
      throw new NotFoundException(`Export with id ${exportId} not found`);

    const box = this.boxRepo.create({
      ...dto,
      shipmentExport: exp,
    });

    return this.boxRepo.save(box);
  }

  async updateBox(
    id: string,
    dto: Partial<CreateBoxDto>,
  ): Promise<ShipmentExportBox> {
    const box = await this.boxRepo.findOne({ where: { id } });
    if (!box) throw new NotFoundException(`Box with id ${id} not found`);

    Object.assign(box, dto);
    return this.boxRepo.save(box);
  }

  async deleteBox(id: string): Promise<void> {
    const result = await this.boxRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Box with id ${id} not found`);
    }
  }

  async getPackagesByBoxId(boxId: string): Promise<Package[]> {
    const box = await this.boxRepo.findOne({
      where: { id: boxId },
      relations: ['packages'],
    });
    if (!box) throw new NotFoundException(`Box with id ${boxId} not found`);
    return box.packages;
  }

  async addPackageToBox(boxId: string, packageId: string): Promise<Package> {
    const box = await this.boxRepo.findOne({ where: { id: boxId } });
    if (!box) throw new NotFoundException(`Box with id ${boxId} not found`);

    const pkg = await this.packageRepo.findOne({ where: { id: packageId } });
    if (!pkg)
      throw new NotFoundException(`Package with id ${packageId} not found`);

    pkg.shipmentExportBox = box;
    return this.packageRepo.save(pkg);
  }

  async removePackageFromBox(packageId: string): Promise<Package> {
    const pkg = await this.packageRepo.findOne({ where: { id: packageId } });
    if (!pkg)
      throw new NotFoundException(`Package with id ${packageId} not found`);

    pkg.shipmentExportBox = null;
    return this.packageRepo.save(pkg);
  }
}
